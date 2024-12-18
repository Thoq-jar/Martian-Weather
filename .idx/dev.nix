{ pkgs, ... }: {
  channel = "stable-23.11";

  packages = [ 
    pkgs.python311
    pkgs.python311Packages.pip
  ];

  idx = {
    extensions = [ "vscodevim.vim" ];

    workspace = {
      onCreate = {
        install-env = "python3 -m venv .venv && . .venv/bin/activate && pip install -r requirements.txt";
      };
      
      onStart = {
        start-flask = ". .venv/bin/activate && flask --app __init__.py run --debug";
      };
    };
  };
}
