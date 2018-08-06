#### Services

Before the store, we had to import the service into every component that needed
it and make calls when the user performed an action. Now, all calls to services
are made through store so each component only imports one thing (the store).

## NGRX

OK, so, every part of the `store` is split into `slices`. 

LB stands for loopback. When loopback generates a library for Angular and Python
it puts literally everything in there. Models, services, the whole lot. In
catanie, this is put into the `shared/sdk` folder.

Not everything loopback provides we need and not everything needs to be in the
store. Anything in the SDK folder should not be edited because it will just
overwrite it when a new one is generated (there are exceptions when the
Typescript is out of date)

If we have a piece of information we want to put into the store, we need to
consider the following 4 things.


### Actions

What can be performed. For Jobs, it could be CREATE, CANCEL. We also have
RETRIEVE for viewing the jobs on the Jobs page later. These kind of tie in with
the HTTP verbs (but not always, because the store does not have to retrieve
anything from the server).

One of the more common examples of the store is a counter. Storing a number in
localstorage and increasing it with an INCREMENT action. The way we have done
it, each action is essentially a class that can have a payload, that payload
will be the changes to make to the store.

### State

The state, once created, makes up the store and (ideally) should remain fixed.
Each `slice` of state makes up the whole store. I.e. a `users` slice could also
have a `movies` slice and a `cinema locations` slice. All of those things
together make up the store. Yep, a slice is like a part of the object. The
structure may be easier to see like this:

```javascript export function rootReducer(state: any, action: Action) { return
combineReducers({ user: userReducer, datasets: datasetsReducer, dashboardUI:
dashboardUIReducer, jobs: jobsReducer })(state, action);

```

So, we have a root reducer here that makes up all of our `slices` and creates
the final store. To access jobs, for example, we would write
`root.jobs.propery`. Ideally, the store should be normalised as much as possible
and not have too many nested objects. 

The state folder we have shows all the slices we put into the store. It is worth
noting that we define two things here: 1. an interface for the slice 2. an
initial state with initial values (this makes it easy to reset the store if we
need to)

### Reducers

We combine every reducer into a single root and we access it through there.

Because the store itself is immutable, we cannot access the slices directly,
this is where we use reducers. A reducer is essentially an operator that is
listening for calls and performing an action when it comes in.

In super simple terms, it is a huge switch statement that goes against basic
programming conventions (because we `return` from each case instead of
`breaking`).

In the user example, we have a few actions. The most important thing to note is
**never return a modified version of the store**. You must always return a brand
spanking new object made from the current state of the store and the new value
you want to modify.

If you never want to run long standing operations (i.e. server calls), these are
the only things you need and every action can just be written to describe their
function (i.e. DELETE_TABLE_ROW).

But, if you want long operations, then this is where effects come in!


### Effects

An effect is similar to a reducer in that it listens for `actions` but it also
returns an action. This means that we generally follow the convention of: 1.
REQUEST - Name of action 2. REQUEST_COMPLETE - Called when the call is complete
3. REQUEST_FAILED

For example, the login effect for a user is maybe the best one.

The login button is clicked and the LOGIN action is fired. We do nothing with
this in the reducer because it changes nothing. However, the effect does listn
for it. The default state is that a user is not logged in so nothing changes.
Once the user is verified and stored in the state, that is where we make a
change.

The services that we used to call from the components should now be removed and
centralised into the relevant effects. In the User example, we grab the
`payload` using the `map` statement.

We then call the `login` method within the service and pass in the user detais.

SUCCESS? Then we fire the LOGIN_COMPLETE action and send a payload of the new
user. The payload just contains the user and the reducer make the change for us.

Our reducer subscribes to LOGIN_COMPLETE, builds a new store from the current
one and the newly logged in user. Any component that needs to know about this
change subscribes to that slice (i.e. the login page) and performs some checks.

FAILURE? Then we fire LOGIN_FAILED and a message to show. Since we actually
check the user credentials against 2 sources, we do not fire a failure
immediately. We fire an AD_LOGIN action to try logging in with Active
Drectory/LDAP. This calls a second effect that tries our next source and then
fires a COMPLETE if it was successful. If it fails, the FAILED is fired and the
user is informed.


TL;DR - Actions in the front end will `dispatch` an action to the relevant slice
of the store, this will then be picked up by the `reducer` or the `effect`
(depending on the name of the action). Changes are carried out and a new store
is returned. Relevant parts of the app subscribe to that slice to be informed of
changes. 
