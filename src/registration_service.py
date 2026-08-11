import re

SUPPORTED_MODULES = {"ISDP371", "RES372", "INF372"}
EMAIL_PATTERN = re.compile(
    r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$"
)


def _require_text(value: str | None, message: str) -> str:
    if value is None or not value.strip():
        raise ValueError(message)
    return value.strip()


def register_student(
    student_number: str | None,
    student_name: str | None,
    student_email: str | None,
    module_code: str | None,
) -> str:
    number = _require_text(student_number, "Student number is required.")
    name = _require_text(student_name, "Student name is required.")
    email = _require_text(student_email, "Student email is required.")
    module = _require_text(module_code, "Module code is required.")

    if not EMAIL_PATTERN.fullmatch(email):
        raise ValueError("A valid student email is required.")

    if module not in SUPPORTED_MODULES:
        raise ValueError("Unsupported module code.")

    return f"{name} ({number}) registered for {module}."    