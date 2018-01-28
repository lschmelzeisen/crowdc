import {GRID_SIZE} from "./grid";
import PriorityQueue from "js-priority-queue";

let neighbors = [
    [-GRID_SIZE, -GRID_SIZE, 14],
    [0, -GRID_SIZE, 10],
    [GRID_SIZE, -GRID_SIZE, 14],

    [-GRID_SIZE, 0, 10],
    [GRID_SIZE, 0, 10],

    [-GRID_SIZE, GRID_SIZE, 14],
    [0, GRID_SIZE, 10],
    [GRID_SIZE, GRID_SIZE, 14]
];

function isWallIfInBounds(x, y, state) {
    if (x >= 0 && x < state.walls.wallMatrix.length && y >= 0 && y < state.walls.wallMatrix.length) {
        return state.walls.convertedMatrix[y][x];
    } else return false;
}

function isBlocked(x, y, position, state) {
    return isWallIfInBounds(x,y,state);
    // switch (position) {
    //     case 0: return isWallIfInBounds(x,y,state) || isWallIfInBounds(x+1,y,state) || isWallIfInBounds(x,y-1,state);
    //     case 1: return isWallIfInBounds(x,y,state) || isWallIfInBounds(x-1,y,state) || isWallIfInBounds(x+1,y,state);
    //     case 2: return isWallIfInBounds(x,y,state) || isWallIfInBounds(x-1,y,state) || isWallIfInBounds(x,y+1,state);
    //     case 3: return isWallIfInBounds(x,y,state) || isWallIfInBounds(x,y-1,state) || isWallIfInBounds(x,y+1,state);
    //     case 4: return isWallIfInBounds(x,y,state) || isWallIfInBounds(x,y-1,state) || isWallIfInBounds(x,y+1,state);
    //     case 5: return isWallIfInBounds(x,y,state) || isWallIfInBounds(x+1,y,state) || isWallIfInBounds(x,y-1,state);
    //     case 6: return isWallIfInBounds(x,y,state) || isWallIfInBounds(x-1,y,state) || isWallIfInBounds(x+1,y,state);
    //     case 7: return isWallIfInBounds(x,y,state) || isWallIfInBounds(x,y-1,state) || isWallIfInBounds(x-1,y,state);
    //     default: throw "Fuck Javascript";
    // }
}

// Dijkstra, must still extend to A*
export function findPath(from, to, state) {

    // console.log("(2,1):" + state.walls.wallMatrix[1][2]);
    // console.log("(2,2):" + state.walls.wallMatrix[2][2]);
    let start = state.grid.toGridCoordsFromPos(from);
    let stop = state.grid.toGridCoordsFromPos(to);
    let seen = new Array(GRID_SIZE);
    for (let i = 0; i !== GRID_SIZE; ++i)
        seen[i] = Array(GRID_SIZE).fill(false);

    let queue = new PriorityQueue({
        comparator: function (a, b) {
            return a.costs - b.costs;
        }
    });

    queue.queue({costs: 0, path: [start]});
    while (queue.length > 0) {
        let node = queue.dequeue();
        let lastPosition = node.path[node.path.length - 1];

        if (seen[lastPosition.y / GRID_SIZE][lastPosition.x / GRID_SIZE]) continue;

        if (lastPosition.equals(stop)) return node.path;
        seen[lastPosition.y / GRID_SIZE][lastPosition.x / GRID_SIZE] = true;

        neighbors.forEach((neighbor, idx) => {

            let nx = lastPosition.x + neighbor[0];
            let ny = lastPosition.y + neighbor[1];

            if ((nx >= 0 && nx < state.map.width) &&
                (ny >= 0 && ny < state.map.height)) {

                if (!isBlocked(nx / GRID_SIZE, ny / GRID_SIZE, idx, state)) {
                    //if ((nx >= 0 && nx < state.map.width) &&
                    //    (ny >= 0 && ny < state.map.height)) {
                    let i = node.path.length;
                    let new_path = Array(i);
                    while (i--) new_path[i] = node.path[i];

                    let newpos = new Phaser.Point(nx, ny);
                    new_path.push(newpos);
                    let new_node = {
                        costs: node.costs + neighbor[2],
                        path: new_path
                    };
                    queue.queue(new_node);
                }
            }
        });
    }
    return [];
}