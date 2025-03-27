from flask import Flask
import os

# App factory
def create_app() -> Flask:
    # Create app instance
    app: Flask = Flask(__name__, template_folder='templates')

    # Create instance folder
    try:
        os.makedirs(app.instance_path)
    except OSError:
        print("warn: could not create instance folder!")
        pass

    # Register blueprints
    from src.routes import bp as main_bp
    app.register_blueprint(main_bp)

    return app


# Create the app instance
app = create_app()

# Run the app if this file is executed directly
if __name__ == '__main__':
    app.run(debug=True)
