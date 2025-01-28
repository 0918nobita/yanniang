use thiserror::Error;
use unicode_segmentation::UnicodeSegmentation;
use vec1::Vec1;

#[derive(Debug, Clone)]
pub struct Password(String);

#[derive(Debug, Error, PartialEq)]
pub enum PasswordError {
    #[error("Too short")]
    TooShort,

    #[error("Too long")]
    TooLong,

    #[error("Invalid char")]
    InvalidChar,

    #[error("Has no digit")]
    HasNoDigit,

    #[error("Has no uppercase")]
    HasNoUppercase,

    #[error("Has no lowercase")]
    HasNoLowercase,

    #[error("Has no special char")]
    HasNoSpecialChar,
}

impl Password {
    #[tracing::instrument(skip(raw_password))]
    pub fn new(raw_password: &str) -> Result<Self, Vec1<PasswordError>> {
        let mut errors = Vec::new();

        let graphemes = raw_password.graphemes(true);

        for grapheme in graphemes {
            if grapheme.len() > 1 {
                errors.push(PasswordError::InvalidChar);
            }

            let c = grapheme.chars().nth(0).unwrap();

            if !c.is_ascii() || c.is_whitespace() {
                errors.push(PasswordError::InvalidChar);
            }
        }

        let len = raw_password.len();

        if len < 12 {
            errors.push(PasswordError::TooShort);
        } else if len > 64 {
            errors.push(PasswordError::TooLong);
        }

        if !raw_password.chars().any(|c| c.is_ascii_digit()) {
            errors.push(PasswordError::HasNoDigit);
        }

        if !raw_password.chars().any(|c| c.is_ascii_uppercase()) {
            errors.push(PasswordError::HasNoUppercase);
        }

        if !raw_password.chars().any(|c| c.is_ascii_lowercase()) {
            errors.push(PasswordError::HasNoLowercase);
        }

        if !raw_password.chars().any(|c| !c.is_ascii_alphanumeric()) {
            errors.push(PasswordError::HasNoSpecialChar);
        }

        match Vec1::try_from(errors) {
            Ok(mut errors) => {
                errors.dedup();
                Err(errors)
            }
            Err(_) => Ok(Password(raw_password.to_string())),
        }
    }
}

impl std::fmt::Display for Password {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.0)
    }
}
