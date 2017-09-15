/**
 * 开发版本的文件导入
 */
(function (){
    var paths  = [
            'editor.js',
            'core/browser.js',
            'core/utils.js',
            'core/EventBase.js',
            'core/dtd.js',
            'core/domUtils.js',
            'core/Range.js',
            'core/Selection.js',
            'core/Editor.js',
            'core/Editor.defaultoptions.js',
            'core/loadconfig.js',
            'core/ajax.js',
            'core/filterword.js',
            'core/node.js',
            'core/htmlparser.js',
            'core/filternode.js',
            'core/plugin.js',
            'core/keymap.js',
            'core/localstorage.js',
            'plugins/defaultfilter.js',
            'plugins/inserthtml.js',
            'plugins/autotypeset.js',
            'plugins/autosubmit.js',
            'plugins/background.js',
            'plugins/image.js',
            'plugins/justify.js',
            'plugins/font.js',
            'plugins/link.js',
            'plugins/iframe.js',
            'plugins/scrawl.js',
            'plugins/removeformat.js',
            'plugins/blockquote.js',
            'plugins/convertcase.js',
            'plugins/indent.js',
            'plugins/print.js',
            'plugins/preview.js',
            'plugins/selectall.js',
            'plugins/paragraph.js',
            'plugins/directionality.js',
            'plugins/horizontal.js',
            'plugins/time.js',
            'plugins/rowspacing.js',
            'plugins/lineheight.js',
            'plugins/insertcode.js',
            'plugins/cleardoc.js',
            'plugins/anchor.js',
            'plugins/wordcount.js',
            'plugins/pagebreak.js',
            'plugins/wordimage.js',
            'plugins/dragdrop.js',
            'plugins/undo.js',
            'plugins/copy.js',
            'plugins/paste.js',
            'plugins/puretxtpaste.js',
            'plugins/list.js',
            'plugins/source.js',
            'plugins/enterkey.js',
            'plugins/keystrokes.js',
            'plugins/fiximgclick.js',
            'plugins/autolink.js',
            'plugins/autoheight.js',
            'plugins/autofloat.js',
            'plugins/video.js',
            'plugins/table.core.js',
            'plugins/table.cmds.js',
            'plugins/table.action.js',
            'plugins/table.sort.js',
            'plugins/contextmenu.js',
            'plugins/shortcutmenu.js',
            'plugins/basestyle.js',
            'plugins/elementpath.js',
            'plugins/formatmatch.js',
            'plugins/searchreplace.js',
            'plugins/customstyle.js',
            'plugins/catchremoteimage.js',
            'plugins/snapscreen.js',
            'plugins/insertparagraph.js',
            'plugins/webapp.js',
            'plugins/template.js',
            'plugins/music.js',
            'plugins/autoupload.js',
            'plugins/autosave.js',
            'plugins/charts.js',
            'plugins/section.js',
            'plugins/simpleupload.js',
            'plugins/serverparam.js',
            'plugins/insertfile.js',
            'plugins/xssFilter.js',
            'ui/ui.js',
            'ui/uiutils.js',
            'ui/uibase.js',
            'ui/separator.js',
            'ui/mask.js',
            'ui/popup.js',
            'ui/colorpicker.js',
            'ui/tablepicker.js',
            'ui/stateful.js',
            'ui/button.js',
            'ui/splitbutton.js',
            'ui/colorbutton.js',
            'ui/tablebutton.js',
            'ui/autotypesetpicker.js',
            'ui/autotypesetbutton.js',
            'ui/cellalignpicker.js',
            'ui/pastepicker.js',
            'ui/toolbar.js',
            'ui/menu.js',
            'ui/combox.js',
            'ui/dialog.js',
            'ui/menubutton.js',
            'ui/multiMenu.js',
            'ui/shortcutmenu.js',
            'ui/breakline.js',
            'ui/message.js',
            'adapter/editorui.js',
            'adapter/editor.js',
            'adapter/message.js',
            'adapter/autosave.js'
        ],
        baseURL = 'js_components/ueditor/_src/';
    for (var i=0;i < paths.length;i++) {
        document.write('<script language=javascript src= ' + baseURL + paths[i] + '></script>');
    }
})();


//document.write("<script language=javascript src=’/js/import.js’></script>");
/*

<script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/editor.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/core/browser.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/core/utils.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/core/EventBase.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/core/dtd.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/core/domUtils.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/core/Range.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/core/Selection.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/core/Editor.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/core/Editor.defaultoptions.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/core/loadconfig.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/core/ajax.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/core/filterword.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/core/node.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/core/htmlparser.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/core/filternode.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/core/plugin.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/core/keymap.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/core/localstorage.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/defaultfilter.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/inserthtml.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/autotypeset.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/autosubmit.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/background.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/image.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/justify.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/font.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/link.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/iframe.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/scrawl.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/removeformat.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/blockquote.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/convertcase.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/indent.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/print.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/preview.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/selectall.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/paragraph.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/directionality.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/horizontal.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/time.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/rowspacing.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/lineheight.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/insertcode.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/cleardoc.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/anchor.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/wordcount.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/pagebreak.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/wordimage.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/dragdrop.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/undo.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/copy.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/paste.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/puretxtpaste.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/list.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/source.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/enterkey.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/keystrokes.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/fiximgclick.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/autolink.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/autoheight.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/autofloat.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/video.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/table.core.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/table.cmds.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/table.action.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/table.sort.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/contextmenu.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/shortcutmenu.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/basestyle.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/elementpath.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/formatmatch.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/searchreplace.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/customstyle.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/catchremoteimage.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/snapscreen.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/insertparagraph.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/webapp.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/template.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/music.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/autoupload.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/autosave.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/charts.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/section.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/simpleupload.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/serverparam.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/insertfile.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/plugins/xssFilter.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/ui/ui.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/ui/uiutils.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/ui/uibase.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/ui/separator.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/ui/mask.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/ui/popup.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/ui/colorpicker.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/ui/tablepicker.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/ui/stateful.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/ui/button.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/ui/splitbutton.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/ui/colorbutton.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/ui/tablebutton.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/ui/autotypesetpicker.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/ui/autotypesetbutton.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/ui/cellalignpicker.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/ui/pastepicker.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/ui/toolbar.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/ui/menu.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/ui/combox.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/ui/dialog.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/ui/menubutton.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/ui/multiMenu.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/ui/shortcutmenu.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/ui/breakline.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/ui/message.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/adapter/editorui.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/adapter/editor.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/adapter/message.js"></script>
    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/_src/adapter/autosave.js"></script>

    <script type="text/javascript" charset="utf-8" src="js_components/ueditor/lang/zh-cn/zh-cn.js"></script>
*/

