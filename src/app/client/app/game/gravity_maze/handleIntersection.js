module.exports = handleIntersection;

function handleIntersection (block, ball) {
    var L = block.x;
    var T = block.y;
    var R = block.x + block.width;
    var B = block.y + block.height;
    var radius = ball.radius;
    var start = {
        x: ball.x + ball.radius,
        y: ball.y + ball.radius
    };
    var end = {
        x: start.x + ball.deltX,
        y: start.y + ball.deltY
    };

    // If the bounding box around the start and end points (+radius on all
    // sides) does not intersect with the rectangle, definitely not an
    // intersection
    if ((Math.max( start.x, end.x ) + radius < L) ||
        (Math.min( start.x, end.x ) - radius > R) ||
        (Math.max( start.y, end.y ) + radius < T) ||
        (Math.min( start.y, end.y ) - radius > B) )
    {
        return null;
    }

    var dx = end.x - start.x;
    var dy = end.y - start.y;
    var invdx = (dx === 0 ? 0 : 1 / dx);
    var invdy = (dy === 0 ? 0 : 1 / dy);
    var cornerX = Number.MAX_VALUE;
    var cornerY = Number.MAX_VALUE;
    var ltime = Number.MAX_VALUE;
    var ttime = Number.MAX_VALUE;
    var rtime = Number.MAX_VALUE;
    var btime = Number.MAX_VALUE;
    var ly, ry, tx, bx;
    // Calculate intersection times with each side's plane
    // Check each side's quadrant for single-side intersection
    // Calculate Corner

    /** Left Side **/
    // Does the circle go from the left side to the right side of the rectangle's left?
    if ( start.x - radius < L && end.x + radius > L ) {
        ltime = ((L - radius) - start.x) * invdx;
        if (ltime >= 0 && ltime <= 1)
        {
            ly = dy * ltime + start.y;
            // Does the collisions point lie on the left side?
            if (ly >= T && ly <= B)
            {
                return new Intersection( dx * ltime + start.x, ly, ltime, -1, 0, L, ly );
            }
        }
        cornerX = L;
    }

    /** Right Side **/
    // Does the circle go from the right side to the left side of the rectangle's right?
    if ( start.x + radius > R && end.x - radius < R )
    {
        rtime = (start.x - (R + radius)) * -1 * invdx;
        if (rtime >= 0 && rtime <= 1)
        {
            ry = dy * rtime + start.y;
            // Does the collisions point lie on the right side?
            if (ry >= T && ry <= B)
            {
                return new Intersection( dx * rtime + start.x, ry, rtime, 1, 0, R, ry );
            }
        }
        cornerX = R;
    }

    /** Top Side **/
    // Does the circle go from the top side to the bottom side of the rectangle's top?
    if (start.y - radius < T && end.y + radius > T)
    {
        ttime = ((T - radius) - start.y) * invdy;
        if (ttime >= 0 && ttime <= 1)
        {
            tx = dx * ttime + start.x;
            // Does the collisions point lie on the top side?
            if (tx >= L && tx <= R)
            {
                return new Intersection( tx, dy * ttime + start.y, ttime, 0, -1, tx, T );
            }
        }
        cornerY = T;
    }

    /** Bottom Side **/
    // Does the circle go from the bottom side to the top side of the rectangle's bottom?
    if (start.y + radius > B && end.y - radius < B)
    {
        btime = (start.y - (B + radius)) * -1 * invdy;
        if (btime >= 0 && btime <= 1) {
            bx = dx * btime + start.x;
            // Does the collisions point lie on the bottom side?
            if (bx >= L && bx <= R)
            {
                return new Intersection( bx, dy * btime + start.y, btime, 0, 1, bx, B );
            }
        }
        cornerY = B;
    }

    // No intersection at all!
    if (cornerX === Number.MAX_VALUE && cornerY === Number.MAX_VALUE) {
        return null;
    }

    // Account for the times where we don't pass over a side but we do hit it's corner
    if (cornerX !== Number.MAX_VALUE && cornerY === Number.MAX_VALUE)
    {
        cornerY = (dy > 0 ? B : T);
    }
    if (cornerY !== Number.MAX_VALUE && cornerX === Number.MAX_VALUE)
    {
        cornerX = (dx > 0 ? R : L);
    }

    /* Solve the triangle between the start, corner, and intersection point.
     *
     *           +-----------T-----------+
     *           |                       |
     *          L|                       |R
     *           |                       |
     *           C-----------B-----------+
     *          / \
     *         /   \r     _.-E
     *        /     \ _.-'
     *       /    _.-I
     *      / _.-'
     *     S-'
     *
     * S = start of circle's path
     * E = end of circle's path
     * LTRB = sides of the rectangle
     * I = {ix, iY} = point at which the circle intersects with the rectangle
     * C = corner of intersection (and collision point)
     * C=>I (r) = {nx, ny} = radius and intersection normal
     * S=>C = cornerdist
     * S=>I = intersectionDistance
     * S=>E = lineLength
     * <S = innerAngle
     * <I = angle1
     * <C = angle2
     */

    var inverseRadius = 1.0 / radius;
    var lineLength = Math.sqrt( dx * dx + dy * dy );
    var cornerdx = cornerX - start.x;
    var cornerdy = cornerY - start.y;
    var cornerDistance = Math.sqrt( cornerdx * cornerdx + cornerdy * cornerdy );
    var innerAngle = Math.acos( (cornerdx * dx + cornerdy * dy) / (lineLength * cornerDistance) );
    var time, ix, iy, nx, ny;
    // If the circle is too close, no intersection.
    if (cornerDistance < radius) {
        return null;
    }

    // If inner angle is zero, it's going to hit the corner straight on.
    if (innerAngle === 0) {
        time = (cornerDistance - radius) / lineLength;

        // If time is outside the boundaries, return null. This algorithm can
        // return a negative time which indicates a previous intersection, and
        // can also return a time > 1.0f which can predict a corner intersection.
        if (time > 1 || time < 0) {
            return null;
        }

        ix = time * dx + start.x;
        iy = time * dy + start.y;
        nx = cornerdx / cornerDistance;
        ny = cornerdy / cornerDistance;

        return new Intersection( ix, iy, time, nx, ny, cornerX, cornerY );
    }

    var innerAngleSin = Math.sin( innerAngle );
    var angle1Sin = innerAngleSin * cornerDistance * inverseRadius;

    // The angle is too large, there cannot be an intersection
    if (Math.abs( angle1Sin ) > 1) {
        return null;
    }

    var angle1 = Math.PI - Math.asin( angle1Sin );
    var angle2 = Math.PI - innerAngle - angle1;
    var intersectionDistance = radius * Math.sin( angle2 ) / innerAngleSin;

    // Solve for time
    time = intersectionDistance / lineLength;

    // If time is outside the boundaries, return null. This algorithm can
    // return a negative time which indicates a previous intersection, and
    // can also return a time > 1.0f which can predict a corner intersection.
    if (time > 1 || time < 0) {
        return null;
    }

    // Solve the intersection and normal
    ix = time * dx + start.x;
    iy = time * dy + start.y;
    nx = ((ix - cornerX) * inverseRadius);
    ny = ((iy - cornerY) * inverseRadius);

    return new Intersection( ix, iy, time, nx, ny, cornerX, cornerY );
}

function Intersection (x, y, t, nx, ny, ix, iy) {
    return {
        cx: x,
        cy: y,
        time: t,
        nx: nx,
        ny: ny,
        ix: ix,
        iy: iy
    };
}