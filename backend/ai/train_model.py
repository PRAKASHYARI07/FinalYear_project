import sys
from pathlib import Path
import pandas as pd
from sklearn.pipeline import make_pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import joblib

BASE_DIR = Path(__file__).resolve().parent
CSV_PATH = BASE_DIR / "dataset.csv"
OUT_MODEL = BASE_DIR / "department_model.pkl"

if not CSV_PATH.exists():
    print(f"dataset.csv not found at {CSV_PATH}")
    sys.exit(1)

df = pd.read_csv(CSV_PATH)


if "description" not in df.columns or "complaint_type" not in df.columns:
    print("Required columns not found.")
    print("Available columns:", list(df.columns))
    sys.exit(1)


df = df[["description", "complaint_type"]].dropna()
df.columns = ["description", "department"]


min_samples = 20
counts = df["department"].value_counts()
df = df[df["department"].isin(counts[counts >= min_samples].index)]

# TRAIN / TEST SPLIT
X = df["description"].astype(str)
y = df["department"].astype(str)

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

pipe = make_pipeline(
    TfidfVectorizer(max_features=20000, ngram_range=(1, 2)),
    LogisticRegression(max_iter=1000)
)

print("Training department classifier on", len(X_train), "samples")
pipe.fit(X_train, y_train)

acc = pipe.score(X_test, y_test)
print(f"\nValidation accuracy: {acc:.4f}")

y_pred = pipe.predict(X_test)

print("\nClassification Report:\n")
print(classification_report(y_test, y_pred))

joblib.dump(pipe, OUT_MODEL)
print("\nSaved department model to", OUT_MODEL)
