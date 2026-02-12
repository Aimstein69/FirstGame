using System;
using System.IO;
using Microsoft.Web.WebView2.Core;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;


namespace Rpg2D
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            Loaded += MainWindow_Loaded;
        }

   private async void MainWindow_Loaded(object sender, RoutedEventArgs e)
{
    await GameView.EnsureCoreWebView2Async();

    string root = System.IO.Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "wwwroot");

    // 🔥 On crée un serveur virtuel interne
    GameView.CoreWebView2.SetVirtualHostNameToFolderMapping(
        "local.game",
        root,
        CoreWebView2HostResourceAccessKind.Allow
    );

    // On charge la page via HTTP virtuel
    GameView.CoreWebView2.Navigate("https://local.game/index.html");


            // 👉 ICI : on ajoute l'événement NavigationCompleted
            GameView.CoreWebView2.NavigationCompleted += async (s, args2) =>
            {
                // Test : déplacer le joueur à (200, 150)
                await GameView.CoreWebView2.ExecuteScriptAsync("updatePlayerPosition(200, 150);");
            };
        }
    }
}

