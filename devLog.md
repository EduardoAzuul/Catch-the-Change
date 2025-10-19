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




