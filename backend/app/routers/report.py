from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ai.predict import predict_department

from app.db.database import get_db
from app.models.report import Report
from app.models.user import User
from app.core.auth import get_current_user
from app.schemas.report import ReportOut, ReportCreate, ReportStatusUpdate
from app.core.admin import admin_required


router = APIRouter(prefix="/reports", tags=["Reports"])



@router.post("/", response_model=ReportOut)
def create_report(
    report: ReportCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # AI predicts department / complaint type and generates summary
    complaint_type, department, ai_summary = predict_department(report.description)

    new_report = Report(
        title=report.title,
        description=report.description,
        status="pending",
        category=complaint_type,
        department=department,
        ai_summary=ai_summary,
        user_id=current_user.id
    )

    db.add(new_report)
    db.commit()
    db.refresh(new_report)

    return new_report

@router.get("/admin/all")
def get_all_reports_admin(
    db: Session = Depends(get_db),
    admin=Depends(admin_required)
):
    return db.query(Report).all()



@router.get("/", response_model=List[ReportOut])
def get_reports(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role == "admin":
        return db.query(Report).all()
    return db.query(Report).filter(Report.user_id == current_user.id).all()


@router.put("/{report_id}/status")
def update_report_status(
    report_id: int,
    data: ReportStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admin can update status")

    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    report.status = data.status
    db.commit()
    db.refresh(report)
    return report
