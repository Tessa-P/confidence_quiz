"""rename option fields to snake_case

Revision ID: b7b86091712e
Revises: afa32472f3f7
Create Date: 2026-08-28 17:52:37.239207

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes


# revision identifiers, used by Alembic.
revision = 'b7b86091712e'
down_revision = 'afa32472f3f7'
branch_labels = None
depends_on = None


def upgrade():
    op.alter_column('quizquestion', 'optionA', new_column_name='option_a')
    op.alter_column('quizquestion', 'optionB', new_column_name='option_b')


def downgrade():
    op.alter_column('quizquestion', 'option_a', new_column_name='optionA')
    op.alter_column('quizquestion', 'option_b', new_column_name='optionB')
