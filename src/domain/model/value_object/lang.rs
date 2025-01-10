use thiserror::Error;

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum Lang {
    Ja = 0,
    ZhCn = 1,
}

#[derive(Debug, Error)]
#[error("Invalid lang")]
pub struct InvalidLangError;

impl TryFrom<i32> for Lang {
    type Error = InvalidLangError;

    fn try_from(value: i32) -> Result<Self, Self::Error> {
        match value {
            0 => Ok(Lang::Ja),
            1 => Ok(Lang::ZhCn),
            _ => Err(InvalidLangError),
        }
    }
}
