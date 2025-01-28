use std::fmt::Debug;

use argon2::PasswordHash;
use color_eyre::eyre::eyre;

use crate::value_object::{Handle, UserId};

#[derive(Clone)]
pub struct User {
    pub id: UserId,
    pub handle: Handle,
    pub display_name: String,
    password_hash: String,
}

impl User {
    pub fn new(id: UserId, handle: Handle, display_name: String, password_hash: String) -> Self {
        Self {
            id,
            handle,
            display_name,
            password_hash,
        }
    }

    pub fn password_hash(&self) -> color_eyre::Result<PasswordHash<'_>> {
        PasswordHash::new(&self.password_hash)
            .map_err(|_| eyre!("Failed to parse the password hash"))
    }
}

impl Debug for User {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        #[derive(Debug)]
        #[allow(dead_code)]
        struct User<'a> {
            id: &'a UserId,
            handle: &'a Handle,
        }

        let Self { id, handle, .. } = self;

        Debug::fmt(&User { id, handle }, f)
    }
}
