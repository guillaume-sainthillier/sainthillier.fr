$(document).ready(function()
{
    $('.editor-simple').summernote({
        toolbar: [
            ['misc', ['fullscreen', 'codeview']]
        ]
    });
    
    $('.editor-complex').summernote({
        toolbar: [
            ['insert', ['link']],
            ['layout', ['ul','ol','paragraph']],
            ['misc', ['fullscreen', 'codeview']]
        ]
    });
});