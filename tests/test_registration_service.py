import pytest
from src.registration_service import register_student


def test_tc01_valid_registration_returns_confirmation():
    result = register_student(
        "21001621",
        "James Williams",
        "student@example.com",
        "ISDP371",
    )
    assert result == "James Williams (21001621) registered for ISDP371."


def test_tc02_blank_student_number_is_rejected():
    with pytest.raises(ValueError, match="Student number is required."):
        register_student(" ", "James Williams", "student@example.com", "ISDP371")


def test_tc03_blank_student_name_is_rejected():
    with pytest.raises(ValueError, match="Student name is required."):
        register_student("21001621", " ", "student@example.com", "ISDP371")


def test_tc04_blank_email_is_rejected():
    with pytest.raises(ValueError, match="Student email is required."):
        register_student("21001621", "James Williams", " ", "ISDP371")


@pytest.mark.parametrize(
    "invalid_email",
    ["student-at-example.com", "student@", "@example.com"],
)
def test_tc05_invalid_emails_are_rejected(invalid_email):
    with pytest.raises(ValueError, match="A valid student email is required."):
        register_student("21001621", "James Williams", invalid_email, "ISDP371")


def test_tc06_blank_module_is_rejected():
    with pytest.raises(ValueError, match="Module code is required."):
        register_student("21001621", "James Williams", "student@example.com", " ")


def test_tc07_unsupported_module_is_rejected():
    with pytest.raises(ValueError, match="Unsupported module code."):
        register_student("21001621", "James Williams", "student@example.com", "ABC101")


def test_tc08_input_is_trimmed():
    result = register_student(
        " 21001621 ", " James Williams ", " student@example.com ", " ISDP371 ",
    )
    assert result == "James Williams (21001621) registered for ISDP371."
