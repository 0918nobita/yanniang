use tower_cookies::Cookies;

use super::AuthenticatedUser;

pub async fn logout(_: AuthenticatedUser, _cookies: Cookies) {
    unimplemented!()
}
