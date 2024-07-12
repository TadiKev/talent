from locust import HttpUser, task, between

class TalentVerifyUser(HttpUser):
    wait_time = between(1, 5)

    @task(1)
    def index(self):
        self.client.get("/")

    @task(2)
    def search_employees(self):
        self.client.get("/api/employees/?search=John")

    @task(3)
    def bulk_upload(self):
        with open("employees.csv", "rb") as file:
            self.client.post("/api/employees/bulk_upload/", files={"file": file})

    def on_start(self):
        self.client.post("/api/login/", json={"username": "testuser", "password": "testpassword"})
