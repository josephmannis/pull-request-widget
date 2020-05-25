## Open Pull Request Widget

[http://tracesof.net/uebersicht/](http://tracesof.net/uebersicht/)


### Installation
#### Permissions
This widget requires a personal Github API key to work. To generate one, [follow the instructions here](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line).

You will need to give this token full `user` access to retrieve PRs on public repositories.

If you want to see PRs on private repositories, you also need to give it full `repo` access.

**Be sure you don't share this token with anyone. Delete it from GitHub if you think someone has it.**

#### Configure the Widget
1. Download the widget binary from the releases tab.
2. Drop the folder into your Übersicht widget folder.
3. Open `index.js` and add your personal github API key to the `GITHUB_KEY` constant. Save the file.

Your widget should be running. 💵


### Clicking Links with Übersicht
Übersicht has a preference for an Interaction Shortcut that allows widget elements to be clicked while holding a configured modifier key. 

To select this key, click the Übersicht icon in the top sytem bar, and hit preferenes. 

Out of the box, Übersicht doesn't ask for Accessibility access, so this preference doesn't appear to work at first. Add Übersicht to the list of apps in System Preferences > Security & Privacy > Privacy > Input Monitoring in order for this to work as expected.

Once the Interaction Shortcut is allowed and configured, the PR titles are clickable and will open in your default browser.