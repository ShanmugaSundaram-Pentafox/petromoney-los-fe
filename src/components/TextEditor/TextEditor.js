import { makeStyles, Tooltip } from '@material-ui/core';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import HardBreak from '@tiptap/extension-hard-break';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit';
import React from 'react'
import './styles.css';


const useStyles = makeStyles({
  root:{
    border: '1px solid rgb(0,0,0,0.3)',
    borderRadius: 4,
    padding: 6,
    minHeight: '13vh',
    minWidth: '30vw',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  actions: {
    paddingBottom: 6,
    borderBottom: '1px solid rgb(0,0,0,0.4)',
    display: 'flex',
    alignItems: 'center'
  },
  btn: {
    width: 30,
    height: 30,
    backgroundColor: '#fff',
    border: 'none',
    borderRadius: 5,
    cursor: 'pointer',
    color: 'gray',
    marginLeft: 4,
    transition: 'all 0.35s',
    '&:hover': {
      backgroundColor: '#f4f4f2',
      color: 'black'
    },
  },
  active: {
    width: 30,
    height: 30,
    backgroundColor: '#efeeec',
    border: '1.5px solid rgb(0,0,0,0.2)',
    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px',
    borderRadius: 5,
    cursor: 'pointer',
    marginLeft: 4,
  },
  textbox: {
    padding: 15,
    paddingLeft: 20
  },
  content: {
    minWidth: '30rem',
    margin: 5,
    padding: 5,
    '.ProseMirror:focus': {
      outline: 'none',
    }
  }
})

export const TextEditor = ({ setJSON, toolBar, remarkData, editable, style }) => {
  const classes = useStyles();
  const editor = useEditor({
    extensions: [
      StarterKit, Placeholder, Underline, HardBreak
    ],
    onUpdate({ editor }) {
      setJSON(editor.getHTML())
    },
    content: remarkData,
    editable: editable
  });

  return (
    <div className={classes.root} id='rooter' style={style}>
      {
        toolBar &&
          <MenuBar editor={editor} />
      }
      <EditorContent editor={editor} className={classes.content}/>
    </div>
  )
}

export const MenuBar = ({ editor }) => {
  const classes = useStyles();
  if (!editor) {
    return null
  }

  return(
    <div className={classes.actions}>
      <Tooltip title='Paragraph'>
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={editor.isActive('paragraph') ? classes.active : classes.btn}
        ><strong>P</strong></button>
      </Tooltip>
      <Tooltip title='Bold'>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? classes.active : classes.btn}
        ><strong>B</strong></button>
      </Tooltip>
      <Tooltip title='Italic'>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? classes.active : classes.btn}
        ><i>I</i></button>
      </Tooltip>
      <Tooltip title='Underline'>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive('underline') ? classes.active : classes.btn}
        ><u>U</u></button>
      </Tooltip>
      <Tooltip title='Large'>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? classes.active : classes.btn}
        >H1</button>
      </Tooltip>
      <Tooltip title='Medium'>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive('heading', { level: 3 }) ? classes.active : classes.btn}
        >H2</button>
      </Tooltip>
      <Tooltip title='Small'>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
          className={editor.isActive('heading', { level: 4 }) ? classes.active : classes.btn}
        >H3</button>
      </Tooltip>
      <Tooltip title='Bullet'>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? classes.active : classes.btn}
        ><FormatListBulletedIcon fontSize='small' /></button>
      </Tooltip>
      <Tooltip title='Numbers'>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? classes.active : classes.btn}
        ><FormatListNumberedIcon fontSize='small' /></button>
      </Tooltip>
      <Tooltip title='Break'>
        <button
          onClick={() => editor.chain().focus().setHardBreak().run()}
          className={editor.isActive('hardBreak') ? classes.active : classes.btn}
        >Br</button>
      </Tooltip>
    </div>
  )
}
