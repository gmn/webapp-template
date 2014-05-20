/*********************
 * creates itself and attaches instance to window, global namespace
 */
(function(window,name) {

    function ledger() {
        return ledger;
    }

    ledger.prototype.Ajax = function( formdata, callback ) 
    {
        $.ajax({
            url: "ajax_handler.php",
            type:"POST",
            data: formdata,
            dataType: "json",
            success: callback
        });
    };

    // attach 
    window[name] = new ledger();

})(window,"z");
