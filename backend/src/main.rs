use std::sync::Arc;

use shuttle_runtime::SecretStore;
use sqlx::PgPool;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};
use yanniang_infrastructure::persistence::{
    query::{PgSummaryQueryRepository, PgUserQueryRepository},
    PgSessionRepository,
};
use yanniang_presentation::{routes, AppState};
use yanniang_usecase::{
    FindSummaryByUuidImpl, ListSummariesImpl, LoginImpl, LogoutImpl, VerifySessionImpl,
};

#[shuttle_runtime::main]
async fn main(
    #[shuttle_runtime::Secrets] _secrets: SecretStore,
    #[shuttle_shared_db::Postgres] pool: PgPool,
) -> shuttle_axum::ShuttleAxum {
    color_eyre::install().expect("Failed to install color_eyre");

    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::try_from_default_env().unwrap_or("debug".into()))
        .with(tracing_subscriber::fmt::layer())
        .init();

    tracing::info!("Tracing is initialized");

    sqlx::migrate!()
        .run(&pool)
        .await
        .expect("Failed to run migrations");

    let session_repo = PgSessionRepository::new(pool.clone());
    let user_query_repo = PgUserQueryRepository::new(pool.clone());
    let summary_query_repo = PgSummaryQueryRepository::new(pool.clone());

    let verify_session = VerifySessionImpl::new(session_repo.clone());
    let login = LoginImpl::new(session_repo.clone(), user_query_repo);
    let logout = LogoutImpl::new(session_repo);

    let find_summary_by_uuid = FindSummaryByUuidImpl::new(summary_query_repo.clone());
    let list_summaries = ListSummariesImpl::new(summary_query_repo);

    let router = routes().with_state(AppState {
        find_summary_by_uuid: Arc::new(find_summary_by_uuid),
        list_summaries: Arc::new(list_summaries),
        verify_session: Arc::new(verify_session),
        login: Arc::new(login),
        logout: Arc::new(logout),
    });

    Ok(router.into())
}
