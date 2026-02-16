import joblib
from pathlib import Path
from .department_mapping import map_to_department

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "department_model.pkl"

try:
    model = joblib.load(MODEL_PATH)
except:
    model = None

def predict_department(description: str):
    """Predict complaint type and generate AI summary"""
    
    # Rule-based detection for common issues
    description_lower = description.lower()
    
    # Water/Utilities issues
    if any(word in description_lower for word in ['water', 'leak', 'pipe', 'flooding', 'sewage', 'drain']):
        return "Water/Utilities", "Utilities Department", "Water or plumbing issue detected"
    
    # Traffic issues
    if any(word in description_lower for word in ['pothole', 'road', 'street light', 'broken light', 'traffic']):
        return "Traffic/Infrastructure", "Traffic Department", "Road or traffic infrastructure issue"
    
    # Garbage/Sanitation
    if any(word in description_lower for word in ['garbage', 'trash', 'litter', 'waste', 'dirty']):
        return "Sanitation", "Sanitation Department", "Garbage or waste management issue"
    
    # Use ML model if available
    if model:
        try:
            complaint_type = model.predict([description])[0]
            department = map_to_department(complaint_type)
            summary = f"Complaint classified as {complaint_type}"
            return complaint_type, department, summary
        except:
            pass
    
    # Default
    return "Other", "General Administration", "Issue reported"

