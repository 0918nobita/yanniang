use std::collections::HashSet;

use thiserror::Error;
use tracing::instrument;
use unicode_segmentation::UnicodeSegmentation;

use crate::value_object::{Handle, Lang, UserId};

#[derive(Debug, Clone)]
pub struct User {
    id: UserId,
    handle: Handle,
    display_name: String,
    native_langs: HashSet<Lang>,
    learning_langs: HashSet<Lang>,
}

#[derive(Debug, Error)]
pub enum UserDisplayNameErr {
    #[error("display name is empty")]
    Empty,

    #[error("display name is too long")]
    TooLong,
}

#[instrument]
fn validate_display_name(display_name: &str) -> Result<(), UserDisplayNameErr> {
    if display_name.is_empty() {
        return Err(UserDisplayNameErr::Empty);
    }

    if display_name.graphemes(true).count() > 20 {
        return Err(UserDisplayNameErr::TooLong);
    }

    Ok(())
}

impl User {
    #[instrument]
    pub fn new(
        id: UserId,
        handle: Handle,
        display_name: String,
        native_langs: HashSet<Lang>,
        learning_langs: HashSet<Lang>,
    ) -> Result<Self, UserDisplayNameErr> {
        validate_display_name(&display_name)?;

        Ok(Self {
            id,
            handle,
            display_name,
            native_langs,
            learning_langs,
        })
    }

    pub fn id(&self) -> &UserId {
        &self.id
    }

    pub fn handle(&self) -> &Handle {
        &self.handle
    }

    pub fn change_handle(&mut self, handle: Handle) {
        self.handle = handle;
    }

    pub fn display_name(&self) -> &str {
        &self.display_name
    }

    #[instrument]
    pub fn change_display_name(&mut self, display_name: String) -> Result<(), UserDisplayNameErr> {
        validate_display_name(&display_name)?;

        self.display_name = display_name;

        Ok(())
    }

    pub fn native_langs(&self) -> &HashSet<Lang> {
        &self.native_langs
    }

    pub fn add_native_lang(&mut self, lang: Lang) {
        self.native_langs.insert(lang);
    }

    pub fn remove_native_lang(&mut self, lang: &Lang) {
        self.native_langs.remove(lang);
    }

    pub fn learning_langs(&self) -> &HashSet<Lang> {
        &self.learning_langs
    }

    pub fn add_learning_lang(&mut self, lang: Lang) {
        self.learning_langs.insert(lang);
    }

    pub fn remove_learning_lang(&mut self, lang: &Lang) {
        self.learning_langs.remove(lang);
    }
}

impl PartialEq for User {
    fn eq(&self, other: &Self) -> bool {
        self.id == other.id
    }
}

impl Eq for User {}

#[cfg(test)]
mod tests {
    use std::collections::HashSet;

    use crate::value_object::{Handle, UserId};

    use super::{User, UserDisplayNameErr};

    #[test]
    fn test_valid_user() {
        let res = User::new(
            UserId::new(1),
            Handle::new("test".to_owned()).unwrap(),
            "Test User".to_owned(),
            HashSet::new(),
            HashSet::new(),
        );

        assert!(res.is_ok());
    }

    #[test]
    fn test_display_name_empty() {
        let res = User::new(
            UserId::new(1),
            Handle::new("test".to_owned()).unwrap(),
            "".to_owned(),
            HashSet::new(),
            HashSet::new(),
        );

        assert!(matches!(res, Err(UserDisplayNameErr::Empty)));
    }

    #[test]
    fn test_display_name_too_long() {
        let res = User::new(
            UserId::new(1),
            Handle::new("test".to_owned()).unwrap(),
            "好".repeat(21),
            HashSet::new(),
            HashSet::new(),
        );

        assert!(matches!(res, Err(UserDisplayNameErr::TooLong)));
    }
}
