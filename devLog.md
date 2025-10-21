Date: 18/10/25
José Eduardo Moreno Paredes
Project / Module: Catch the Change - Web Development

Goals for the documented session
    Complete map integration and refactor common components
    transform header and footer into reusable EJS components
    transform htmls into EJS templates
    add map functionality to fishing activity page
    add necessary routes in app.js
    add required dependencies if any
    update of proyect structure
    creation of comandsRedquired.md file
    add devLog.md file for future documentation of development process
    add geoJson files for
    map functionality
    removal of incesessary files (map.js)

List what you planned to accomplish. (e.g)
    [ :) ]Complete map integration and refactor common components
    [ :) ]transform header and footer into reusable EJS components
    [ :) ]transform htmls into EJS templates
    [ :) ]add map functionality to fishing activity page
    [ :) ]add necessary routes in app.js
    [ :) ]add required dependencies if any
    [ :) ]update of proyect structure
    [ :) ]creation of comandsRedquired.md file
    [ :) ]add devLog.md file for future documentation of development process
    [ :) ]add geoJson files for
    [ :) ]map functionality
    [ :) ]removal of incesessary files (map.js)

Describe what you actually worked on. (e.g)

In this development session, the project was refactored to improve maintainability and functionality.
The header and footer were transformed into reusable EJS components,nd all static HTML files were converted into EJS templates.
Full map functionality was added to the Fishing Activity page using GeoJSON data, with corresponding routes updated in app.js 
and unnecessary files like map.js removed.The project structure was reorganized, required dependencies were added, 
and documentation files comandsRequired.md and devLog.md were created to support future development.

Document how you used Gen AI (e.g., Copilot, ChatGPT, etc.)

    Prompt: "I want to connect my GEOJSONs into my ejs element called map. The geojsons are files that contain the information 
    for the commercial zone in mexico and two geojson about the protected areas"

    Output: AI provided two implementation sugestion options:
    1. Frontend approach using fetch() to load GeoJSON files directly
    2. Backend approach using fs.readFileSync() to pass data through EJS templating
    AI recommended Option 2 for better performance and provided complete code examples 
    for both app.js route handler and map.ejs integration using Leaflet.js

    Edits: 
    - Essential css for map height added to map container
    - GeoJSON data loaded server-side in app.js using fs.readFileSync
    - Added inline styles and CSS classes to legend color indicators for visual distinction
    - Moved console.log statements earlier for better debugging

    Reflection: The back-and-forth helped me understand:
    - How EJS templating variables are passed from Express routes (res.render with data object)
    - The <%- %> syntax for injecting unescaped content (necessary for JSON)
    - Why Leaflet maps require explicit height styling to render
    - The trade-off between server-side file reading vs client-side fetching

    What I Learned:
    - Server-side data loading pattern: read files → parse JSON → stringify → pass to template → parse in frontend
    - Leaflet.js GeoJSON layer integration with styling, popups, and controls
    - CSS requirement: map containers need explicit height or they render at 0px
    - EJS variable scope: variables must be passed through res.render() object to be accessible in templates
    - Debugging approach: using console.log to verify data loading before rendering



**************************************************


20/10/25 - Jetzuvely González

Project / Module: Catch the Change - Web Development

Planned goals for the session:

[ :) ] Make CSS changes to improve design and responsiveness.

[ :) ] Research how to implement maps using GeoJSON.

[ :) ] Test how to use the navigation toggle and media queries.

Work actually done:
In this session, I focused mainly on improving the CSS of the website, adjusting elements such as the Mission section and the navigation bar to make them more responsive and visually appealing across different screen sizes. I also researched how to use GeoJSON maps to display commercial zones and protected areas in Mexico, although full integration will be done in future sessions. Additionally, I tested features such as the navigation toggle and media queries to control the visibility and size of certain elements on mobile devices.

Learning and observations:

Adjusting CSS and media queries requires attention to the behavior of each element on different devices.

Understanding the logic of toggles and responsive menus helps improve user experience.

Researching GeoJSON maps gave me insight into available methods and tools, even though full implementation will come later.
I used AI mainly to clarify specific doubts and learn new techniques. I asked for help with:

Implementing the navigation toggle.

Using media queries to make images and sections responsive.

Understanding GeoJSON map integration methods.

AI provided clear suggestions, code examples, and guidance that helped me apply these features correctly. I also complemented this with tutorial videos to better understand the concepts. Overall, AI supported my learning without doing the work for me.

