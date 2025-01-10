use crate::domain::model::entity::LearningContent;

#[derive(Debug)]
pub struct LearningContentAggregate {
    content: LearningContent,
}

impl LearningContentAggregate {
    pub fn new(content: LearningContent) -> Self {
        Self { content }
    }

    pub fn content(&self) -> &LearningContent {
        &self.content
    }
}
