import pandas as pd

# Replace 'your_dataset.csv' with the actual name of your file
file_path = 'AI-based Career Recommendation System.csv' 

try:
    df = pd.read_csv(file_path)

    # 1. Extract and Clean Skills
    all_skills = set()
    # Assuming the column is named 'skills' or 'Skills'
    if 'skills' in df.columns:
        col_name = 'skills'
    elif 'Skills' in df.columns:
        col_name = 'Skills'
    else:
        col_name = None

    if col_name:
        for item in df[col_name]:
            # Split by comma if they are like "python, java, c++"
            if isinstance(item, str):
                parts = item.split(',')
                for p in parts:
                    all_skills.add(p.strip().lower())

    # 2. Extract and Clean Interests
    all_interests = set()
    if 'interests' in df.columns:
        col_name = 'interests'
    elif 'Interests' in df.columns:
        col_name = 'Interests'
    else:
        col_name = None

    if col_name:
        for item in df[col_name]:
            if isinstance(item, str):
                parts = item.split(',')
                for p in parts:
                    all_interests.add(p.strip().lower())

    # 3. Extract Careers
    if 'career' in df.columns:
        careers = df['career'].unique()
    elif 'Career' in df.columns:
        careers = df['Career'].unique()
    else:
        careers = []

    # --- PRINT RESULTS ---
    print("----- UNIQUE CAREERS -----")
    for c in careers:
        print(f'"{c}",')

    print("\n----- UNIQUE SKILLS -----")
    for s in sorted(list(all_skills)):
        print(f'"{s}",')

    print("\n----- UNIQUE INTERESTS -----")
    for i in sorted(list(all_interests)):
        print(f'"{i}",')

except Exception as e:
    print(f"Error: {e}")
    print("Make sure the CSV file name matches 'file_path' variable.")