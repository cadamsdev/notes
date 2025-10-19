use tauri::Manager;
use std::env;
use std::path::PathBuf;
use std::fs;

const DB_PATH_KEY: &str = "custom_db_path";

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

// Get the custom database path from storage or return None
fn get_custom_db_path(app: &tauri::AppHandle) -> Option<PathBuf> {
    let config_dir = app.path().app_config_dir().ok()?;
    let config_file = config_dir.join("db_config.json");
    
    if config_file.exists() {
        let content = fs::read_to_string(config_file).ok()?;
        let config: serde_json::Value = serde_json::from_str(&content).ok()?;
        let path_str = config.get(DB_PATH_KEY)?.as_str()?;
        Some(PathBuf::from(path_str))
    } else {
        None
    }
}

// Save the custom database path to storage
fn save_custom_db_path(app: &tauri::AppHandle, path: Option<PathBuf>) -> Result<(), String> {
    let config_dir = app.path().app_config_dir()
        .map_err(|e| format!("Failed to get config directory: {}", e))?;
    
    // Create config directory if it doesn't exist
    fs::create_dir_all(&config_dir)
        .map_err(|e| format!("Failed to create config directory: {}", e))?;
    
    let config_file = config_dir.join("db_config.json");
    
    let config = if let Some(path) = path {
        serde_json::json!({ DB_PATH_KEY: path.to_string_lossy().to_string() })
    } else {
        serde_json::json!({})
    };
    
    fs::write(config_file, config.to_string())
        .map_err(|e| format!("Failed to write config file: {}", e))?;
    
    Ok(())
}

// Get the full database path (custom or default)
fn get_database_path(app: &tauri::AppHandle) -> Result<PathBuf, String> {
    let db_filename = get_db_filename();
    
    // Check for custom path first
    if let Some(custom_path) = get_custom_db_path(app) {
        // Custom path should be a directory, append the filename
        let full_path = custom_path.join(&db_filename);
        println!("Using custom database path: {}", full_path.display());
        return Ok(full_path);
    }
    
    // Fall back to default app data directory
    let app_data_dir = app.path().app_data_dir()
        .map_err(|e| format!("Failed to get app data directory: {}", e))?;
    
    let db_path = app_data_dir.join(&db_filename);
    println!("Using default database path: {}", db_path.display());
    Ok(db_path)
}

#[tauri::command]
fn get_app_version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}

#[tauri::command]
fn get_database_path_cmd(app: tauri::AppHandle) -> Result<String, String> {
    let path = get_database_path(&app)?;
    Ok(path.to_string_lossy().to_string())
}

#[tauri::command]
fn get_database_directory_cmd(app: tauri::AppHandle) -> Result<String, String> {
    if let Some(custom_path) = get_custom_db_path(&app) {
        return Ok(custom_path.to_string_lossy().to_string());
    }
    
    // Return default directory
    let app_data_dir = app.path().app_data_dir()
        .map_err(|e| format!("Failed to get app data directory: {}", e))?;
    Ok(app_data_dir.to_string_lossy().to_string())
}

#[tauri::command]
fn set_database_directory_cmd(app: tauri::AppHandle, directory_path: String) -> Result<String, String> {
    let new_dir = PathBuf::from(&directory_path);
    
    // Validate the directory exists
    if !new_dir.exists() {
        return Err(format!("Directory does not exist: {}", directory_path));
    }
    
    if !new_dir.is_dir() {
        return Err(format!("Path is not a directory: {}", directory_path));
    }
    
    // Get old database path
    let old_db_path = get_database_path(&app)?;
    
    // Calculate what the new database path would be
    let db_filename = get_db_filename();
    let new_db_path = new_dir.join(&db_filename);
    
    // Check if a database already exists at the new location
    if new_db_path.exists() && new_db_path != old_db_path {
        // Database already exists at destination - just switch to it without copying
        println!("Database already exists at destination: {}", new_db_path.display());
        println!("Switching to existing database (not copying)");
    } else if old_db_path.exists() && old_db_path != new_db_path {
        // No database at destination - copy the current one
        // Ensure parent directory exists
        if let Some(parent) = new_db_path.parent() {
            fs::create_dir_all(parent)
                .map_err(|e| format!("Failed to create database directory: {}", e))?;
        }
        
        fs::copy(&old_db_path, &new_db_path)
            .map_err(|e| format!("Failed to copy database: {}", e))?;
        
        println!("Database copied from {} to {}", old_db_path.display(), new_db_path.display());
    }
    
    // Save the new custom path AFTER checking/copying
    save_custom_db_path(&app, Some(new_dir.clone()))?;
    
    Ok(new_db_path.to_string_lossy().to_string())
}

#[tauri::command]
fn reset_database_directory_cmd(app: tauri::AppHandle) -> Result<String, String> {
    // Get old database path before reset
    let old_db_path = get_database_path(&app)?;
    
    // Clear custom path
    save_custom_db_path(&app, None)?;
    
    // Get new (default) database path
    let new_db_path = get_database_path(&app)?;
    
    // Copy database back to default location if it exists at custom location
    if old_db_path.exists() && old_db_path != new_db_path {
        // Ensure parent directory exists
        if let Some(parent) = new_db_path.parent() {
            fs::create_dir_all(parent)
                .map_err(|e| format!("Failed to create database directory: {}", e))?;
        }
        
        fs::copy(&old_db_path, &new_db_path)
            .map_err(|e| format!("Failed to copy database: {}", e))?;
        
        println!("Database copied from {} to {}", old_db_path.display(), new_db_path.display());
    }
    
    Ok(new_db_path.to_string_lossy().to_string())
}

#[tauri::command]
fn open_database_location_cmd(app: tauri::AppHandle) -> Result<(), String> {
    open_database_location(&app)
}

fn open_database_location(app: &tauri::AppHandle) -> Result<(), String> {
    let db_path = get_database_path(app)?;
    
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
        if let Some(parent_dir) = db_path.parent() {
            Command::new("xdg-open")
                .arg(parent_dir)
                .spawn()
                .map_err(|e| format!("Failed to open file manager: {}", e))?;
        }
    }
    
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            open_database_location_cmd,
            get_app_version,
            get_database_path_cmd,
            get_database_directory_cmd,
            set_database_directory_cmd,
            reset_database_directory_cmd
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
