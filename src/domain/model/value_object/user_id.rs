#[derive(Debug, Clone, PartialEq, Eq)]
pub struct UserId(i32);

impl UserId {
    pub fn new(id: i32) -> Self {
        Self(id)
    }
}

impl From<i32> for UserId {
    fn from(id: i32) -> Self {
        Self::new(id)
    }
}
