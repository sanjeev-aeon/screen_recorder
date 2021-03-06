const { app, BrowserWindow, Menu, desktopCapturer, ipcMain, dialog } = require('electron');
const path = require('path');

//
const setSelected = (m, event) => {
  event.sender.send('context-menu-command', { name: m.name, id: m.id });
  console.log(m.name);
}

const createMenu = async (event) => {
  const source = await desktopCapturer.getSources({ types: ['window', 'screen'] });
  const menu = Menu.buildFromTemplate(source.map(m => {
    return {
      label: m.name,
      click: () => setSelected(m, event)
    };
  }));
  menu.popup(BrowserWindow.fromWebContents(event.sender));
}

ipcMain.on('show-context-menu', (event) => {
  createMenu(event);
});

ipcMain.handle('file-path', async () => {
  const { filePath } = await dialog.showSaveDialog({ buttonLabel: 'Save recording', defaultPath: `rec-${Date.now()}.webm` });
  console.log(filePath);
  return filePath;

})
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 1000,
    webPreferences: {
      preload: path.join(__dirname, '/recorder/preload.js'),
      nodeIntegration: true,
      // contextIsolation: false
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  //clean up mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
