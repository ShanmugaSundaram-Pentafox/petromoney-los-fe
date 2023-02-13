import { Button, Divider, Grid, makeStyles, Typography, TextField } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react'
import { useQuery, useMutation } from 'react-query';
import CreatableSelect from 'react-select/creatable';
import { addEmailGroup, getAllMailGroups } from '../../../services/master.service';


const useStyles = makeStyles((theme) => ({
  sidePanelTitle: {
    padding: '24px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    zIndex: 0,
    boxShadow: '0 1px 4px -3px #333',
  },
  root: {
    minWidth: 500,
    display: 'flex',
    flexDirection: 'column',
    padding: 10,
    margin: 10,
    height: '80%',
    borderRadius: 5,
    overflow: 'hidden'
  },
  content: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto'
  },
  card: {
    borderRadius: 4,
    margin: 8,
    padding: 10,
    cursor: 'pointer',
    border: '1px solid #ccc',
    transition: '.2s',
    '&:hover': {
      boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px'
    }
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  cardContent: {
    marginTop: 5,
  },
  item: {
    padding: 4,
    borderBottom: '1px solid #ccc',
    display: 'flex',
    '&:hover': {
      backgroundColor: '#fffcfa',
      borderRadius: 2
    },
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  arrowIcon: {
    color: 'rgb(0,0,0,0.5)',
  },
  action: {
    display: 'flex',
    justifyContent: 'flex-start',
    marginTop: 10
  },
  addForm: {
    margin: 10,
    padding: 25,
    borderRadius: 6,
    boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px',
    width: 500
  },
  formFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 10
  },
  actionButtonsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 16px'
  },

}));
const customStyles = {
  control: (base) => ({
    ...base,
  }),
  dropdownIndicator: (base) => ({
    ...base,
    display: 'none',
  }),
};

const GroupCard = ({ data, handleAdd }) => {
  const classes = useStyles();
  const [collapse, setCollapse] = useState(false)
  const [isEdit, setIsEdit] = useState(true)
  const [emailList, setEmailList] = useState([]);

  const handleChange = (newValue, actionMeta) => {
    setEmailList([...emailList, actionMeta?.option?.value])

  }
  return (
    <div className={classes.card}>
      <div className={classes.header} onClick={() => setCollapse(!collapse)}>
        <Typography variant="h5">{data.group_name}</Typography>
        {
          collapse ? (<KeyboardArrowDownIcon className={classes.arrowIcon} />) : (<KeyboardArrowUpIcon className={classes.arrowIcon} />)
        }
      </div>
      {
        collapse && (
          <>
            <div className={classes.cardContent}>
              <CreatableSelect
                isMulti
                name="resource"
                label="Resource Name"
                isSearchable={false}
                options={data?.email_list}
                defaultValue={data?.email_list}
                isDisabled={isEdit}
                onChange={handleChange}
              />
              {
                data?.email_list?.length === 0 && (
                  <Typography variant='body1' style={{ paddingLeft: 10, color: 'rgb(0,0,0,0.4)' }}>No mail Id found!</Typography>
                )
              }
            </div>
            <div className={classes.action}>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={() => {
                  setIsEdit(false)
                }}
              >
                Add / Edit
              </Button>
              {
                isEdit && (
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={handleAdd}
                    style={{ marginLeft: 10 }}
                  >
                    Save
                  </Button>
                )
              }
            </div>
          </>
        )
      }
    </div>
  )
}

const MasterEmailGroup = ({ callback }) => {
  const classes = useStyles();
  const [emailList, setEmailList] = useState([]);
  const [addGroup, setAddGroup] = useState({ openForm: false, email_list: [] });
  const { enqueueSnackbar } = useSnackbar();


  const { data: mailGroup, refetch } = useQuery(['mailGroup'], () => getAllMailGroups(), {
    refetchOnWindowFocus: false,
    onError: (error) => {
      console.log(error);
    },
  })

  const { mutate: insertMail } = useMutation((data) => addEmailGroup(data), {
    onSuccess: (message) => {
      refetch();
      setAddGroup()
      enqueueSnackbar(message, {
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
        variant: 'success'
      });
    },
    onError: (message) => {
      enqueueSnackbar(message, {
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
        variant: 'error'
      });
    }
  })

  const handleChange = (newValue, actionMeta) => {
    setEmailList([...emailList, actionMeta?.option?.value])
  }
  const handleAddGroup = () => {
    insertMail({ group_name: addGroup?.group_name, group_label: addGroup?.group_label, email_list: emailList })
  }

  return (
    <>
      <Typography variant="h4" className={classes.sidePanelTitle}>
        Email List
        <CloseIcon onClick={callback} />
      </Typography>
      <div className={classes.root}>
        <Typography variant="h6" style={{ marginBottom: 5, marginLeft: 6 }}> Email Groups</Typography>
        <div className={classes.content}>
          {
            mailGroup?.map((data, i) => {
              return (
                <GroupCard data={data} key={i} handleAdd={handleAddGroup} />
              )
            })
          }
        </div>
      </div>
      <div className={classes.actionFooter}>
        {addGroup?.openForm && (
          <form>
            <Grid className={classes.addForm} container spacing={2}>
              <Grid item md={6}>
                <label style={{ marginBottom: 8 }}>Group Name</label>
                <TextField
                  name="remark"
                  fullWidth
                  variant="outlined"
                  value={addGroup?.group_name}
                  onChange={(e) => setAddGroup({ ...addGroup, group_name: e?.target?.value })}
                />
              </Grid>
              <Grid item md={6}>
                <label style={{ marginBottom: 8 }}>Group Label</label>
                <TextField
                  name="remark"
                  fullWidth
                  variant="outlined"
                  value={addGroup?.group_label}
                  onChange={(e) => setAddGroup({ ...addGroup, group_label: e?.target?.value })}

                />
              </Grid>
              <Grid item md={12}>
                <label style={{ marginBottom: 8 }}>Add Email</label>
                <CreatableSelect
                  isMulti
                  name="email"
                  label="Add Email"
                  hideSelectedOptions={false}
                  isDisabled={false}
                  onChange={handleChange}
                  styles={customStyles}
                />
              </Grid>
              <Grid item md={12}>
                <div>
                  <Button color='primary' variant='contained' onClick={handleAddGroup}>
                    Save
                  </Button>
                </div>
              </Grid>
            </Grid>
          </form>
        )}
        <Divider />
        <div className={classes.actionButtonsWrapper}>
          <div>
            <Button variant='outlined' onClick={callback}>
              Back
            </Button>
          </div>
          <div>
            <Button color='primary' variant='contained' onClick={() => setAddGroup({ addGroup, openForm: true })}>
              Add Email Group
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
export default MasterEmailGroup;