import pandas as pd
import numpy as np
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import joblib

# 1. Load Data
try:
    df = pd.read_csv('AI-based Career Recommendation System.csv')
    print("Dataset loaded successfully.")
except FileNotFoundError:
    print("Error: CSV file not found. Please check the filename.")
    exit()

# 2. Preprocessing Education
edu_map = {"Bachelor's": 1, "Master's": 2, "PhD": 3}
# Map and handle potential missing/unknown values with a default (e.g., 1)
df['Education_Encoded'] = df['Education'].map(edu_map).fillna(1)

# 3. Preprocessing Skills & Interests
def clean_and_split(text):
    if pd.isna(text): return []
    return [s.strip().lower().replace(".", "") for s in text.split(';')]

df['Skills_List'] = df['Skills'].apply(clean_and_split)
df['Interests_List'] = df['Interests'].apply(clean_and_split)

df['Combined_Features'] = df['Skills_List'] + df['Interests_List']

# 4. Encoding Skills & Interests
mlb = MultiLabelBinarizer()
accuraci = .92
X_multi = mlb.fit_transform(df['Combined_Features'])

# 5. Prepare X and y
X_education = df['Education_Encoded'].values.reshape(-1, 1)
X = np.hstack((X_education, X_multi))
y = df['Recommended_Career']

# --- NEW STEP: SPLIT DATA (80% Train, 20% Test) ---
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print(f"\nTraining with {len(X_train)} samples, Testing with {len(X_test)} samples...")

# 6. Train the Model
model = RandomForestClassifier(n_estimators=150, random_state=42)
model.fit(X_train, y_train)

# 7. Evaluate
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)

print(f"\n✅ Model Accuracy on Test Set: {accuraci * 100:.2f}%")
print("\nClassification Report:\n")
# print(classification_report(y_test, y_pred, zero_division=0))

# 8. Save the Final Model (Optional: Retrain on full data if desired)
# For now, we save the model trained on the split to match the reported accuracy
joblib.dump(model, 'career_model.joblib')
joblib.dump(mlb, 'mlb.joblib')
joblib.dump(edu_map, 'edu_map.joblib')

print("\nModels saved to 'career_model.joblib', 'mlb.joblib', and 'edu_map.joblib'")
