use uuid::Uuid;

use crate::domain::model::value_object::{ContentId, Lang, UserId};

#[derive(Debug)]
pub struct LearningContent {
    id: ContentId,
    uuid: Uuid,
    front: String,
    back: String,
    front_lang: Lang,
    back_lang: Lang,
    author: UserId,
}

impl LearningContent {
    pub fn new(
        id: ContentId,
        uuid: Uuid,
        front: String,
        back: String,
        front_lang: Lang,
        back_lang: Lang,
        author: UserId,
    ) -> Self {
        Self {
            id,
            uuid,
            front,
            back,
            front_lang,
            back_lang,
            author,
        }
    }

    pub fn id(&self) -> &ContentId {
        &self.id
    }

    pub fn uuid(&self) -> &Uuid {
        &self.uuid
    }

    pub fn front(&self) -> &str {
        &self.front
    }

    pub fn back(&self) -> &str {
        &self.back
    }

    pub fn front_lang(&self) -> &Lang {
        &self.front_lang
    }

    pub fn back_lang(&self) -> &Lang {
        &self.back_lang
    }

    pub fn author(&self) -> &UserId {
        &self.author
    }
}

impl PartialEq for LearningContent {
    fn eq(&self, other: &Self) -> bool {
        self.id == other.id
    }
}

impl Eq for LearningContent {}
