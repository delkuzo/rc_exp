// UI-kit Input: auto-initializer for clear (x) button on all .input-container elements
(function() {
  const initAllInputs = async () => {
    let xIcon = null;
    try {
      if (window.iconSystemV3 && window.iconSystemV3.renderIconOriginal) {
        xIcon = await window.iconSystemV3.renderIconOriginal('xmark', 12, 'icon');
      }
    } catch {}

    const containers = document.querySelectorAll('.input-container');
    containers.forEach((container) => {
      const input = container.querySelector('.input-field');
      if (!input) return;

      let clearBtn = container.querySelector('.input-clear-button');
      if (!clearBtn) {
        clearBtn = document.createElement('button');
        clearBtn.type = 'button';
        clearBtn.className = 'input-clear-button';
        container.appendChild(clearBtn);
      }
      if (xIcon) clearBtn.innerHTML = xIcon;

      const update = () => {
        if (input.value && input.value.length > 0) {
          container.classList.add('with-text');
        } else {
          container.classList.remove('with-text');
        }
      };

      input.addEventListener('input', update);
      clearBtn.addEventListener('click', (e) => {
        e.preventDefault();
        input.value = '';
        update();
        input.focus();
      });

      // initial
      update();
    });
  };

  document.addEventListener('DOMContentLoaded', initAllInputs);
})();


