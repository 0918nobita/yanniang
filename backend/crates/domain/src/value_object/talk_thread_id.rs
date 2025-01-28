#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct TalkThreadId(i32);

impl TalkThreadId {
    pub fn new(id: i32) -> Self {
        Self(id)
    }
}

impl From<TalkThreadId> for i32 {
    fn from(value: TalkThreadId) -> Self {
        value.0
    }
}
