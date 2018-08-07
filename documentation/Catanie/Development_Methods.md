# Git Flow Workflow

![](https://images.duckduckgo.com/iu/?u=http%3A%2F%2F1.bp.blogspot.com%2F-ct9MmWf5gJk%2FU2Pe9V8A5GI%2FAAAAAAAAAT0%2F0Y-XvAb9RB8%2Fs1600%2Fgitflow-orig-diagram.png&f=1)

Currently, this project is being developed by following a variation of the [git flow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) model.

In summary, the following branches should exist and be in the following states:  
1. `master` - always ready to deploy \(manual/time delayed integrations from the `develop` branch\)  
2. `develop` - merge hotfixes and features into this \(this should map to a corresponding development environment on your system\)  
3. `hotfix/<bug_name` - forks from master to fix a known issue \(this issue should be documented in the repository and a branch can be created from within Gitlab  
4. `feature/<feature_name>` - forks from master to a feature branch, explained [here](https://gitlab.psi.ch/help/workflow/workflow.md)

### Releases

A release branch should be created if:

* A fixed release cycle has been set
* A number of features or hotfixes have been incorporated and a release is needed.

Releases should be merged into the master branch and **tagged** with the version number of that release. It goes without saying that a release branch should not be created unless the develop branch is passing all tests.

## Sample Workflow - Creating a feature

```
git pull origin develop
git checkout -b feature/feature_name
# Do some work
git add <changed files>
git commit -m 'COMMIT MESSAGE'

git push origin feature/feature_name
# Click the link shown in the output to create a merge request

# TO RELEASE (ONCE TESTED ON DEVELOP)
git checkout -b release/0.1.1
git merge --no-ff develop
git checkout master
git merge --no-ff release/0.1.1
git branch -D release/0.1.1
```

## Collaborators and Code Review

**All **those involved with development on a project should follow this process exactly. This would mean no committing directly to the master or develop branches and \(unless absolutely necessary\) merge requests should be opened in Gitlab and assigned to anyone that is not yourself.

When your branch has been pushed up to the origin \([https://gitlab.psi.ch](https://gitlab.psi.ch)\), then please open a merge request with your branch name as the source and the `develop` as the target. You can then assign the merge request to somone else within your development team. If you do not know who that is then please assign it to someone working at PSI.

**NOTE** When a new branch is opened it **must** be opened from the `develop` branch. Merge requests opened from other branches will not be accepted.

## Once Merged

When your code has been merged by the assignee, you will receive an email and you can then do the following commands

```
git pull origin master #always make sure you are up to date
git branch -d <branch_name> #remove local branch
```

## Working locally

The general git advice for working locally is to commit often. Not every commit needs to be pushed immediately but it is worth ensuring that the remote is never too far behind your local. Always be sure to pull **before** you push and test all merge conflicts once you have fixed them. NOTE: The angular cli \(and webpack\) will provide feedback on unhandled merges so it is worth using! For detailed info on best practices [this](https://sethrobertson.github.io/GitBestPractices/) is a great guide.

### No-FF \(TL;DR - THIS SHOULD ALWAYS BE USED\)

No-ff is a vital flag because it forces a merge commit to be inserted into the history of the main branch, without it, merge will try and fast forward the HEAD of the branch to the latest commit. In essence, without this flag, there will **not** be a visible merge commit in the history,

### INFO: Rebase vs. Merge

A lot of information can be found on the web but the basics of it are:

* Rebase rewrites histories  \(and allows for interactive editing of commits\)
* Merge will maintain history of commits \(although the `squash` flag can reduce this and bring your branch tip back in line with the master.

### Git Pull

Some sites have mentioned that simply using a `git pull` \(which is essentially a `git fetch` followed by a `git merge` will likely cause issues in large teams due to the changing nature of the branch meaning that you will experience merge commits. It is my personal opinion that this should not be a problem if work is never done directly on the master and the regular practice of pulling down before any major action is followed.

However, it should be noted that `git fetch origin` and `git rebase --preserve-merges origin/<branch_name>` will ensure that a history is maintained and merge conflicts are avoided where possible.

Once a feature is complete \(and tested locally\), it should be merged into the latest version of `develop (following the release cycle outlined above)` and tested on the whole. If the tests pass, the develop can then be merged with master and any new merges to master should cause it to redeploy.

## Current status:

CI is in the process of being implemented and should be prioritised at each site.

# Useful git commands

* `git branch -r` -  List all branches
* `git fetch -p` -  Update branches from remote and remove deleted branches locally
* `git merge --no-ff <branch>` -  Merge branch into current branch
* `git branch -d <branch>` -  Remove branch once merged 

## Git Flow Plugin

Support for the git flow commands as an extension to git can be found here:

[https://github.com/nvie/gitflow](https://github.com/nvie/gitflow)

This does mean that the `master` and `develop` branches cannot be protected as they need to be pushed to from the local repository.

### Quickstart

```
git flow init (accept all prompts)

#feature
git flow feature start NAME
# commits etc
git push origin feature/NAME # open merge request on Gitlab here

#release
git flow release start vVERSION_NUMBER
# commits and bump version number
git flow release finish vVERSION_NUMBER
git push origin --all # OR git push origin master
```



