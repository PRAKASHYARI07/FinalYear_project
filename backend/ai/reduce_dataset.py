import sys
from pathlib import Path
import pandas as pd

# Resolve paths relative to this script
BASE_DIR = Path(__file__).resolve().parent
CSV_PATH = BASE_DIR / "dataset.csv"

if not CSV_PATH.exists():
	print(f"dataset.csv not found at {CSV_PATH}")
	sys.exit(1)

# Load large dataset
df = pd.read_csv(CSV_PATH)
print("Original size:", len(df))

# Keep only required columns (update if column names differ)
def _find_column(df, keywords):
	for col in df.columns:
		lc = col.lower()
		for kw in keywords:
			if kw in lc:
				return col
	return None

# auto-detect description and complaint type columns (tolerant to spacing/case)
desc_col = _find_column(df, ["description", "descriptor", "resolution description", "resolution"])
comp_col = _find_column(df, ["complaint type", "complaint", "complaint_type"]) or _find_column(df, ["agency name"]) 
agency_col = _find_column(df, ["agency name", "agency", "agency_name"]) or _find_column(df, ["agency"]) 

if not desc_col or not comp_col:
	print(f"Could not auto-detect required columns. Found desc={desc_col}, comp={comp_col}")
	print(f"Available columns: {list(df.columns)}")
	sys.exit(1)

# include agency_col if available for department classification
cols = [desc_col, comp_col]
if agency_col:
	cols.append(agency_col)

df = df[cols]
# Normalize column names for downstream processing
names = ["description", "complaint_type"]
if agency_col:
	names.append("agency_name")
df.columns = names

# Drop null values
df = df.dropna()

# Sampling size (adjustable)
REQUESTED_N = 20000
if len(df) < REQUESTED_N:
	print(f"Dataset has only {len(df)} rows after cleaning; using full dataset instead of sampling {REQUESTED_N} rows.")
	df_small = df.copy()
else:
	df_small = df.sample(n=REQUESTED_N, random_state=42)

# Save smaller dataset next to original
OUT_PATH = BASE_DIR / "dataset_small.csv"
df_small.to_csv(OUT_PATH, index=False)

print("New dataset created with:", len(df_small), "->", OUT_PATH)
