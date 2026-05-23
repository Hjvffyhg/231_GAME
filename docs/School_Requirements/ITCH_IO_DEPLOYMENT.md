# Itch.io Submission Guide: Space Survival

This guide translates the official School Requirements for submitting the final game output to itch.io, specifically tailored for our React (Vite) application architecture.

## Step 1: Exporting the Game as HTML/WebGL
Because this game was built using React and Vite (rather than a traditional engine like Unity), exporting to an HTML5 web package is already integrated into our build process.

1. Open your terminal or AI Studio prompt and run:
   ```bash
   npm run build
   ```
2. This generates a definitive `dist` folder located in the root of the project.
3. Open the `dist` folder. You will see an `index.html` file right at the top level, alongside nested `/assets/` directories containing the compiled JS/CSS. This structure is precisely what itch.io expects.

## Step 2: Compress the Game Files into ZIP
itch.io requires a compressed `.zip` file of the folder contents, **not** the folder itself.

1. Navigate **inside** your newly generated `dist` folder.
2. Select everything inside (`index.html`, `/assets/`, etc.). 
3. **Right-click -> Compress/Zip** (e.g. `Send to > Compressed (zipped) folder` on Windows, or `Compress X Items` on Mac).
4. Name the resulting file something recognizable, like `SpaceSurvival_Final.zip`.
*Crucial*: If you open `SpaceSurvival_Final.zip`, the `index.html` file must be directly accessible on the first level, not enclosed inside an extra `dist` subfolder.

## Step 3: Log In to itch.io
1. Go to [itch.io](https://itch.io/) and log in.
2. Open your profile menu drop-down and go to your **Dashboard**.

## Step 4: Create a New Project
1. Click the **Create new project** button.
2. Fill out the core project properties:
   - **Title**: Space Survival (or your final team title)
   - **Short Description**: A sci-fi tactical action game utilizing OS CPU scheduling algorithms (FCFS, Priority, RR, HRRN) to calculate combat priorities.
   - **Classification**: Games
   - **Kind of Project**: **HTML Game** *(This is mandatory for the game to be played natively in the browser).*

## Step 5: Upload the ZIP File
1. Scroll down to the **Uploads** section and click **Upload files**.
2. Select your `SpaceSurvival_Final.zip` file.
3. Once completed, a checkbox will appear next to the file:
   - **MUST CHECK**: ✔️ *"This file will be played in the browser"*

## Step 6: Set the Embed Options
These settings ensure the game scales correctly with our Vite responsive layout:

- **Embed in page**: Enabled
- **Viewport dimensions**: `1280` x `720` (Recommended to preserve widescreen aspect logic)
- **Mobile friendly**: Check this if our joysticks are active, otherwise leave default.
- **Fullscreen button**: ✔️ Enabled

## Step 7: Game Details & Description
In the details box, include your required mechanics overview. 

**Demo Sample Description**:
```
### Space Survival
A tactical space defense simulator combining top-down action with Operating System scheduling principles.

**Controls:**
W, A, S, D / Arrows - Move Frame
Mouse Cursor / Touch - Adjust aiming trajectory
Q / E - Cycle between OS Schedulers (FCFS, Patrolling, Round Robin, HRRN)
Space Bar / P - Tactical Pause & Target Queue Inspection
Esc - System Pause

**Objective:**
Test various CPU scheduling algorithms against increasing swarms of hostile threat anomalies. Evaluate the differences in wait-time and priorities when using basic FCFS versus dynamic Priority response loops.
```

## Step 8: Set Pricing & Visibility
1. **Pricing**: Choose **No payments or free** to ensure your instructor and evaluators can instantly access the application without entering payment details.
2. **Save & View**: Click **Save and view page** at the bottom (this creates the draft).
3. **Visibility**: If you are ready for grading, go back to Edit Game -> Visibility at the bottom, and change it from **Draft** to **Public** (or **Restricted** and provide the shareable password, though Public is safest for instructors).

## Step 9: Final Verification
1. Click the **Play** button that appears over the game banner on your final page link.
2. Verify the `index.html` properly bootstraps the React application.
3. Verify your assets (ships, bullets) load correctly.
4. Copy the URL (e.g. `https://your-group.itch.io/space-survival`) and attach it to your Final Progress Report along with your 5-minute video demo.
