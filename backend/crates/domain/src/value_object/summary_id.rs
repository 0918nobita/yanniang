#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct SummaryId(i32);

impl SummaryId {
    pub fn new(id: i32) -> Self {
        Self(id)
    }
}

impl From<SummaryId> for i32 {
    fn from(value: SummaryId) -> Self {
        value.0
    }
}
