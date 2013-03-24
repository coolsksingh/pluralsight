/*
 * GET pet's page.
 */

exports.maru = function(req, res){
    res.render('maru', {message: "Maru the Box King" });
};
exports.tard = function(req, res){
    res.render('tard', { message: 'Tardar Sauce the "Grumpy Cat"' });
};
exports.colonel = function(req, res){
    res.render('colonel', { message: "Colonel Meow the Angriest Internet Cat" });
};
exports.snoopy = function(req, res){
    res.render('snoopy', { message: "Snoopy the Cutest Cat Ever" });
};
exports.venus = function(req, res){
    res.render('venus', { message: "Venus the Two Faces Cat" });
};
exports.simon = function(req, res){
    res.render('simons_cat', { message: "Simon's cat" });
};
