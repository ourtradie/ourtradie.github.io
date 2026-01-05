$(document).ready(function () {
    var AFFIX_TOP_LIMIT = 100;
    var AFFIX_OFFSET = 20;

    var $menu = $("#menu"),
        $btn = $("#menu-toggle");

    $("#menu-toggle").on("click", function () {
        $menu.toggleClass("open");
        return false;
    });

    // Mobile navigation toggle
    var $mobileToggle = $("#mobileNavToggle");
    var $docsNav = $(".docs-nav");
    
    if ($mobileToggle.length) {
        $mobileToggle.on("click", function() {
            $docsNav.toggleClass("mobile-open");
        });
        
        // Close nav when clicking outside on mobile
        $(document).on("click", function(e) {
            if ($(window).width() <= 959) {
                if (!$docsNav.is(e.target) && $docsNav.has(e.target).length === 0 && 
                    !$mobileToggle.is(e.target) && $mobileToggle.has(e.target).length === 0) {
                    $docsNav.removeClass("mobile-open");
                }
            }
        });
    }

    // Smooth scroll for anchor links
    $('a[href^="#"]').on('click', function(e) {
        var href = $(this).attr('href');
        if (href && href !== '#' && href.length > 1) {
            var target = $(href);
            if (target.length) {
                e.preventDefault();
                var targetTop = target.offset().top - 100;
                $('html, body').stop().animate({
                    scrollTop: targetTop
                }, 500, 'swing');
            }
        }
    });

    $(".docs-nav").each(function () {
        var $affixNav = $(this),
            $container = $affixNav.parent(),
            affixNavfixed = false,
            originalClassName = this.className,
            current = null,
            $links = $affixNav.find("a");

        function getClosestHeader(top) {
            var last = $links.first();

            if (top < AFFIX_TOP_LIMIT) {
                return last;
            }

            for (var i = 0; i < $links.length; i++) {
                var $link = $links.eq(i),
                    href = $link.attr("href");

                if (href && href.charAt(0) === "#" && href.length > 1) {
                    var $anchor = $(href).first();

                    if ($anchor.length > 0) {
                        var offset = $anchor.offset();

                        if (top < offset.top - AFFIX_OFFSET) {
                            return last;
                        }

                        last = $link;
                    }
                }
            }
            return last;
        }

        // Use requestAnimationFrame for better scroll performance
        var ticking = false;
        function updateNavPosition() {
            var top = window.scrollY || window.pageYOffset;

            // Update sidebar position based on scroll
            if (top > 20) {
                $affixNav.addClass("fixed");
            } else {
                $affixNav.removeClass("fixed");
            }

            // Update active navigation item
            var $current = getClosestHeader(top);

            if (current !== $current) {
                $affixNav.find(".active, .cc-active").removeClass("active cc-active");
                $current.addClass("active cc-active");
                current = $current;
            }
            
            ticking = false;
        }

        $(window).on("scroll", function (evt) {
            if (!ticking) {
                window.requestAnimationFrame(updateNavPosition);
                ticking = true;
            }
        });

        // Trigger scroll on page load to set initial active state
        $(window).trigger('scroll');
    });

    // Initialize code prettify
    if (typeof prettyPrint !== 'undefined') {
        prettyPrint();
    }

    // Initialize scroll to fixed for header (with better performance)
    if ($.fn.scrollToFixed) {
        try {
            $('header').scrollToFixed({
                zIndex: 999,
                limit: function() {
                    return $('footer').offset().top - $('header').outerHeight(true);
                }
            });
        } catch(e) {
            console.warn('scrollToFixed initialization failed:', e);
        }
    }

    // Add fade-in animation for content
    $('.docs-content > *').each(function(index) {
        $(this).css({
            'opacity': '0',
            'animation': 'fadeIn 0.5s ease forwards',
            'animation-delay': (index * 0.05) + 's'
        });
    });
});

// Add CSS animation for fade-in
if (!document.getElementById('fadeInStyles')) {
    var style = document.createElement('style');
    style.id = 'fadeInStyles';
    style.textContent = `
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}
