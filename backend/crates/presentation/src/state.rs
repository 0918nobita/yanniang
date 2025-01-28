use std::sync::Arc;

use yanniang_domain::usecase::{FindSummaryByUuid, ListSummaries, Login, Logout, VerifySession};

use crate::auth::VerifySessionUseCaseProvider;

#[derive(Clone)]
pub struct AppState {
    pub find_summary_by_uuid: Arc<dyn FindSummaryByUuid>,
    pub list_summaries: Arc<dyn ListSummaries>,
    pub verify_session: Arc<dyn VerifySession>,
    pub login: Arc<dyn Login>,
    pub logout: Arc<dyn Logout>,
}

impl VerifySessionUseCaseProvider for AppState {
    fn verify_session(&self) -> Arc<dyn VerifySession> {
        self.verify_session.clone()
    }
}
