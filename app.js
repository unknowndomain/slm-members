var express = require('express'),
    _ = require("underscore"),
    swig = require("swig");

module.exports = {
    "title": "Frontpage",
    "name": "frontpage",
    "app": function membership (config, db, site) {
        var app = express();
        _.extend(app.locals, site.locals);
        
        app.set('views', __dirname + "/views");
        
        site.use("/static", express.static(__dirname + "/" + config.static_dir));
        
        app.get('/', function index (req, res) {
            var user = res.locals.user;
            if (user) {
                if (req.session.email && (!user.provided_details())) {
                    res.locals.flash("warning", "Details Required.", "Please enter your personal details to continue.");
                    res.redirect("/membership");
                }
                else {
                    // get all members
                    var all_members = res.locals.User.all({ where: {
                        disabled: false,
                        approved: true
                    }});
                    
                    var active_members = _.filter(all_members, function (member) {
                        member.is_active();
                    });
                    
                    res.render("members",{members: active_members, members_count: active_members.length});
                }
            }
            else {
                res.locals.flash("danger", "Not logged in.", "You cannot access the members list when not logged in.");
                res.redirect("/");
            }
        });
        
        return app;
    }
}

