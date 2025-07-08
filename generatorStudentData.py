import csv
from faker import Faker
import random

# Initialize Faker for generating random user data
fake = Faker()

# Define the CSV file name
csv_file_name = 'users_data.csv'

# Define the headers based on UserSchema
headers = [
    "first_name", "last_name", "role", "enrollment_number",
    "faculty_number", "department", "course", "semester", "dob"
]

# Define sample values for each field
roles = ["student", "teacher"]
departments = ["Computer Science", "Mathematics", "Physics", "Biology"]
courses = ["MCA", "B.Sc.", "M.Sc.", "B.Tech"]
semesters = ["1", "2", "3", "4", "5", "6", "7", "8"]

# Generate random user data
def generate_user_data():
    return {
        "first_name": fake.first_name(),
        "last_name": fake.last_name(),
        "role": random.choice(roles),
        "enrollment_number": f"ENR{fake.unique.random_number(digits=6)}",
        "faculty_number": f"FAC{fake.unique.random_number(digits=6)}",
        "department": random.choice(departments),
        "course": random.choice(courses),
        "semester": random.choice(semesters),
        "dob": fake.date_of_birth(minimum_age=18, maximum_age=30)
    }

# Generate and write data to CSV
with open(csv_file_name, mode='w', newline='') as file:
    writer = csv.DictWriter(file, fieldnames=headers)
    writer.writeheader()  # Write headers

    # Generate 100 rows of sample user data
    for _ in range(100):
        user_data = generate_user_data()
        writer.writerow(user_data)

print(f"{csv_file_name} has been created with sample user data.")
