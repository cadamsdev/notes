use tauri::Manager;
use std::env;

// Get the database filename based on environment
fn get_db_filename() -> String {
    // Check if we should use test database (set via environment variable)
    let use_test_db = env::var("TAURI_ENV_USE_TEST_DB").is_ok();
    let db_name = if use_test_db {
        "notes_test.db"
    } else {
        "notes.db"
    };
    
    println!("TAURI_ENV_USE_TEST_DB: {:?}", env::var("TAURI_ENV_USE_TEST_DB"));
    println!("Using database: {}", db_name);
    
    db_name.to_string()
}

#[tauri::command]
fn get_app_version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}

#[tauri::command]
fn open_database_location_cmd(app: tauri::AppHandle) -> Result<(), String> {
    open_database_location(&app)
}

fn open_database_location(app: &tauri::AppHandle) -> Result<(), String> {
    // Get the app data directory
    let app_data_dir = app.path().app_data_dir()
        .map_err(|e| format!("Failed to get app data directory: {}", e))?;
    
    let db_path = app_data_dir.join(get_db_filename());
    
    // Open the file explorer to the database location
    #[cfg(target_os = "windows")]
    {
        use std::process::Command;
        Command::new("explorer")
            .arg("/select,")
            .arg(&db_path)
            .spawn()
            .map_err(|e| format!("Failed to open explorer: {}", e))?;
    }
    
    #[cfg(target_os = "macos")]
    {
        use std::process::Command;
        Command::new("open")
            .arg("-R")
            .arg(&db_path)
            .spawn()
            .map_err(|e| format!("Failed to open finder: {}", e))?;
    }
    
    #[cfg(target_os = "linux")]
    {
        use std::process::Command;
        // Try to open the parent directory
        let parent_dir = app_data_dir.to_string_lossy().to_string();
        Command::new("xdg-open")
            .arg(&parent_dir)
            .spawn()
            .map_err(|e| format!("Failed to open file manager: {}", e))?;
    }
    
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![open_database_location_cmd, get_app_version])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
