#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct CommentId(i32);

impl CommentId {
    pub fn new(id: i32) -> Self {
        Self(id)
    }
}

impl From<CommentId> for i32 {
    fn from(value: CommentId) -> Self {
        value.0
    }
}
