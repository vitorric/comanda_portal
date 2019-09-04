import React, { Component } from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
import classNames from "classnames";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Hidden from "@material-ui/core/Hidden";
import Poppers from "@material-ui/core/Popper";
import Divider from "@material-ui/core/Divider";
// @material-ui/icons
import Person from "@material-ui/icons/Person";
// core components
import Button from "components/CustomButtons/Button.jsx";

import headerLinksStyle from "assets/jss/material-dashboard-react/components/headerLinksStyle.jsx";

class AdminNavbarLinks extends Component {
  state = {
    openProfile: false
  };
  handleToggleProfile = () => {
    this.setState(state => ({ openProfile: !state.openProfile }));
  };
  handleCloseProfile = event => {
    if (this.anchorProfile.contains(event.target)) {
      return;
    }
    this.setState({ openProfile: false });
  };

  handleGoToProfile = () => {
    this.setState({ openProfile: false });
    window.location = "/admin/configuracao";
  };

  handleLogout = () => {
    this.setState({ openProfile: false });
    localStorage.clear();
    window.location = "/admin/login";
  };

  render() {
    const { classes } = this.props;
    const { openNotifcation, openProfile } = this.state;
    return (
      <div>
        <div className={classes.manager}>
          <Button
            buttonRef={node => {
              this.anchorProfile = node;
            }}
            color={window.innerWidth > 959 ? "transparent" : "white"}
            justIcon={window.innerWidth > 959}
            simple={!(window.innerWidth > 959)}
            aria-owns={openNotifcation ? "profile-menu-list-grow" : null}
            aria-haspopup="true"
            onClick={this.handleToggleProfile}
            className={classes.buttonLink}
          >
            <Person className={classes.icons} />
            <Hidden mdUp implementation="css">
              <p className={classes.linkText}>Profile</p>
            </Hidden>
          </Button>
          <Poppers
            open={openProfile}
            anchorEl={this.anchorProfile}
            transition
            disablePortal
            className={
              classNames({ [classes.popperClose]: !openProfile }) +
              " " +
              classes.popperNav
            }
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                id="profile-menu-list-grow"
                style={{
                  transformOrigin:
                    placement === "bottom" ? "center top" : "center bottom"
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={this.handleCloseProfile}>
                    <MenuList role="menu">
                      <MenuItem
                        onClick={this.handleGoToProfile}
                        className={classes.dropdownItem}
                      >
                        Configuração
                      </MenuItem>
                      <Divider light />
                      <MenuItem
                        onClick={this.handleLogout}
                        className={classes.dropdownItem}
                      >
                        Sair
                      </MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Poppers>
        </div>
      </div>
    );
  }
}

AdminNavbarLinks.propTypes = {
  classes: PropTypes.object
};

export default withStyles(headerLinksStyle)(AdminNavbarLinks);
