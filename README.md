# Code Checker

**Demo:** [rswang.scripts.mit.edu/khanacademy/index.html](rswang.scripts.mit.edu/khanacademy/index.html)

_Tests:_ [rswang.scripts.mit.edu/khanacademy/qunit/test.html](rswang.scripts.mit.edu/khanacademy/qunit/test.html)

### Acorn vs. Esprima

Acorn is faster than Esprima as referenced in this [blog post](http://marijnhaverbeke.nl/blog/acorn.html). As Marijn (who wrote Acorn) notes, he wrote Acorn with Esprima in mind, trying to make it better and faster while still utilizing many of the features and tricks used in Esprima. Considering Acorn is faster and our API needs to run quickly (faster feedback for the user), I decided to use this parser. The documentation for both parsers seemed comparable. Acorn.js also appeared to have more Google search results, which gave me another reason to use it.

### Browser Support

The program works on Chrome, Safari, and Firefox. Unfortunately, I was unable to test the program on Internet Explorer.

### Testing API

The testing API does not quite work for the structures (notice two of the tests in the testing suite will fail until this is fixed!). At the current state of the API, each structure is a list of types that need to be in the code in sequential order, but does not take into account the nesting structures. To do this, I would have used a different walk function (I used acorn.walk.findNodeAfter), but should have used something like acorn.walk.findNodeAt and specified start and end positions. I was short on time, but hope I can figure this bug out over the weekend when I have the time!

By changing some of the base functions, I also think I would have been able to create better functionality and support for different types. Currently the API only supports a handful of elements (var, function, return, etc.).

## Room for improvement:

- Fix the testing API as noted above!
- Use a Javascript library like React to build the UI based on the model. This would definitely improve the current MVC model.
- Create a more intuitive API -- perhaps each whitelist/blacklist/structures passed in should be mapped to a dictionary that returns true or false for each element (whether it passed the whitelist or blacklist test). This would be pretty trivial to implement since it would just require some mapping upon finishing the code checker.
- Add more functionality (support for booleans, else statements, else if statements, typeof operations, etc.).
- Add functionality to delete structures from the structure list. This was non-trivial with my current representation since I'd have to update the indices of each structure, including the DOM elements of the structure blocks.
- Even if the testing API worked as it should, the app currently only supports one requirement at each nesting level. To improve this, I could have represented each structure as an object and allowed lists, strings, or objects to indicate different elements required at each level along with nested objects.
- Be more thorough with test cases!
