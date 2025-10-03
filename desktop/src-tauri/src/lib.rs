use tauri::Manager;
use tauri::menu::{MenuBuilder, MenuItemBuilder, SubmenuBuilder};

fn open_database_location(app: &tauri::AppHandle) -> Result<(), String> {
    // Get the app data directory
    let app_data_dir = app.path().app_data_dir()
        .map_err(|e| format!("Failed to get app data directory: {}", e))?;
    
    let db_path = app_data_dir.join("notes.db");
    
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
        .setup(|app| {
            // Create menu items
            let open_db = MenuItemBuilder::with_id("open_db", "Open Database Location").build(app)?;
            
            // Create File submenu
            let file_menu = SubmenuBuilder::new(app, "File")
                .items(&[&open_db])
                .build()?;
            
            // Build the main menu
            let menu = MenuBuilder::new(app)
                .items(&[&file_menu])
                .build()?;
            
            // Set the menu for the app
            app.set_menu(menu)?;
            
            // Handle menu events
            app.on_menu_event(move |app, event| {
                if event.id() == "open_db" {
                    if let Err(e) = open_database_location(app) {
                        eprintln!("Error opening database location: {}", e);
                    }
                }
            });
            
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
