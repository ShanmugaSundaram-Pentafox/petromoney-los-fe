import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grid from '@material-ui/core/Grid';
import Grow from '@material-ui/core/Grow';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import AddIcon from '@material-ui/icons/Add';
import React from 'react';

const options = [
  'Add Dealer',
  'Add Co-Applicants',
  'Add Guarantor'
];

const AddIconButton = ({ onClickAddMenu }) => {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const handleMenuItemClick = (event, index, type) => {
    setSelectedIndex(index);
    onClickAddMenu(type)
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  return (
    <Grid container direction="column" alignItems="center" >
      <Grid item xs={12}>
        <ButtonGroup variant="outlined" color="primary" ref={anchorRef} aria-label="split button">
          <Button
            color="primary"
            size="large"
            aria-controls={open ? 'split-button-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-label="select merge strategy"
            aria-haspopup="menu"
            onClick={handleToggle}
          >
            <AddIcon fontSize="small" />
          </Button>
        </ButtonGroup>
        <Popper open={open} placement="bottom-end" anchorEl={anchorRef.current} role={undefined} transition>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
              }}
            >
              <Paper elevation={2}>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList id="split-button-menu">
                    {options.map((option, index) => (
                      <MenuItem
                        key={option}
                        onClick={(event) => {
                          const text = event.target.textContent === 'Add Dealer' ? 'DEALER' : event.target.textContent==='Add Guarantor' ? 'GUARANTOR' : 'COAPPLICANT'
                          handleMenuItemClick(event, index, text)
                        }}
                      >
                        {option}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Grid>
    </Grid>
  );
}

export default AddIconButton;