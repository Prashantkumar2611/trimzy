        import { db } from './firebase.js';
        
        // Override console.log to show in the box
        const logBox = document.getElementById('log');
        const oldLog = console.log;
        console.log = function(...args) {
            oldLog(...args);
            const msg = args.join(' ');
            logBox.innerHTML += `<div>> ${msg}</div>`;
            logBox.scrollTop = logBox.scrollHeight;
        };

        // Load and run the sync script
        import('./scratch/sync_ratings.js').then(() => {
            console.log("Migration script execution finished.");
        }).catch(err => {
            console.log("CRITICAL ERROR: " + err.message);
        });
