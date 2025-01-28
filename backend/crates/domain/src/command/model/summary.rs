/*
use crate::value_object::summary_id::SummaryId;

#[derive(Debug, Clone)]
pub struct PrivateSummary {
    id: SummaryId,
}

impl PrivateSummary {
    pub fn new(id: SummaryId) -> Self {
        Self { id }
    }

    pub fn id(&self) -> &SummaryId {
        &self.id
    }
}

impl PartialEq for PrivateSummary {
    fn eq(&self, other: &Self) -> bool {
        self.id == other.id
    }
}

impl Eq for PrivateSummary {}

#[derive(Debug, Clone)]
pub struct PublicSummary {
    pub id: SummaryId,
}

impl PublicSummary {
    pub fn new(id: SummaryId) -> Self {
        Self { id }
    }
}

impl PartialEq for PublicSummary {
    fn eq(&self, other: &Self) -> bool {
        self.id == other.id
    }
}

impl Eq for PublicSummary {}
*/
