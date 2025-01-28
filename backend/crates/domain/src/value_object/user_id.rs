#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct UserId(i32);

impl UserId {
    pub fn new(id: i32) -> Self {
        Self(id)
    }
}

impl From<UserId> for i32 {
    fn from(value: UserId) -> Self {
        value.0
    }
}
