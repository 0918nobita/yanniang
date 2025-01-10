#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ContentId(i32);

impl ContentId {
    pub fn new(id: i32) -> Self {
        Self(id)
    }
}

impl From<i32> for ContentId {
    fn from(id: i32) -> Self {
        Self::new(id)
    }
}
