# Setup

You simply need the latest version of node.js http://nodejs.org/

# Running 

* Run `node server.js`
* Open http://localhost:8000

# Key Files

#### `public/js/loader.js`

This sets up and loads the scene files from the browser.

#### `public/js/scene/`

This directory is the output of PotreeConverter, with `public/js/cloud.js` being the entry point.


#### `public/js/potree/`

This directory is the source of potree.  Whenever updating, just drag and drop over this (and clobber the entire directory).


# Key Libraries / Apps

* MeshLab http://meshlab.sourceforge.net/ is great for viewing `.ply` files
* Potree https://github.com/potree/potree is the OpenGL viewer for converted files
* PotreeConverter https://github.com/potree/PotreeConverter needed to convert `.ply` to potree-compatible formats (have yet to figure out the correct option values to replicate MeshLab)

# Running PotreeConverter

Example:

 `~/PATH_TO/PotreeConverter/build/PotreeConverter/PotreeConverter -o ~/PATH_TO/stereoview/public/js/scene -l 1000 -s 0.01 -p js/scene/ -f rgb --source ~/PATH_TO/out3.ply`
 
On Matt's Machine:
 
`~/Projects/opensource/moorage/PotreeConverter/build/PotreeConverter/PotreeConverter -o ~/Projects/thrivesmart/stereoview/public/js/scene/ -l 1000 -s 0.01 -p js/scene/ -f rgb --source ~/Desktop/viz/out4.ply `